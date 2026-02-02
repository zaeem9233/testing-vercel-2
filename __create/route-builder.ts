/// <reference types="vite/client" />
import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

// Get current directory - handle both dev and production builds
const getApiDir = () => {
  if (import.meta.env.DEV) {
    // In dev, use relative path from __create
    return join(fileURLToPath(new URL('.', import.meta.url)), '../src/app/api');
  } else {
    // In production, try to find the source directory or use process.cwd()
    // The API routes should be in the source, not the build
    const projectRoot = process.cwd();
    return join(projectRoot, 'src/app/api');
  }
};

const __dirname = getApiDir();
if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// Recursively find all route.js files
async function findRouteFiles(dir: string): Promise<string[]> {
  const files = await readdir(dir);
  let routes: string[] = [];

  for (const file of files) {
    try {
      const filePath = join(dir, file);
      const statResult = await stat(filePath);

      if (statResult.isDirectory()) {
        routes = routes.concat(await findRouteFiles(filePath));
      } else if (file === 'route.js') {
        if (import.meta.env.DEV) {
          console.log(`[Route Builder] Found route file: ${filePath}`);
        }
        // Handle root route.js specially
        if (filePath === join(__dirname, 'route.js')) {
          routes.unshift(filePath); // Add to beginning of array
        } else {
          routes.push(filePath);
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }

  return routes;
}

// Helper function to transform file path to Hono route path
function getHonoPath(routeFile: string, baseDir: string): { name: string; pattern: string }[] {
  const relativePath = routeFile.replace(baseDir, '').replace(/^\//, '');
  const parts = relativePath.split('/').filter(Boolean);
  const routeParts = parts.slice(0, -1); // Remove 'route.js'
  if (routeParts.length === 0) {
    return [{ name: 'root', pattern: '' }];
  }
  const transformedParts = routeParts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === '...'
        ? { name: param, pattern: `:${param}{.+}` }
        : { name: param, pattern: `:${param}` };
    }
    return { name: segment, pattern: segment };
  });
  return transformedParts;
}

// Import and register all routes
async function registerRoutes() {
  let routeFiles: string[] = [];
  let apiDir = __dirname;

  if (import.meta.env.DEV) {
    console.log(`[Route Builder] Looking for route files in: ${apiDir}`);
  }

  try {
    // Check if directory exists before trying to read it
    await stat(apiDir);
    routeFiles = await findRouteFiles(apiDir);
  } catch (error) {
    // If directory doesn't exist (e.g., in production build), try alternative paths
    const projectRoot = process.cwd();
    const altPaths = [
      join(projectRoot, 'src/app/api'),
      join(projectRoot, 'build/server/src/app/api'),
      join(dirname(fileURLToPath(import.meta.url)), '../src/app/api'),
    ];

    for (const altPath of altPaths) {
      try {
        await stat(altPath);
        apiDir = altPath;
        routeFiles = await findRouteFiles(altPath);
        break;
      } catch {
        // Try next path
        continue;
      }
    }

    if (routeFiles.length === 0) {
      // In production, routes might be bundled - this is not necessarily an error
      if (import.meta.env.PROD) {
        console.log('API routes directory not found in production build. Routes may be bundled.');
      } else {
        console.warn('Could not find API routes directory. API routes may not be available.');
      }
      return;
    }
  }

  routeFiles = routeFiles
    .slice()
    .sort((a, b) => {
      return b.length - a.length;
    });

  // Clear existing routes
  api.routes = [];

  if (import.meta.env.DEV) {
    console.log(`[Route Builder] Found ${routeFiles.length} route files in ${apiDir}`);
  }

  for (const routeFile of routeFiles) {
    try {
      // Convert absolute path to relative import path
      // routeFile is absolute like /project/src/app/api/videos/route.js
      // route-builder.ts is in __create/, so we need ../src/app/api/videos/route.js
      let importPath: string;

      // Get the directory where route-builder.ts is located
      const routeBuilderDir = fileURLToPath(new URL('.', import.meta.url));
      // Get project root (parent of __create)
      const projectRoot = dirname(routeBuilderDir);

      // Calculate relative path from project root to route file
      const relativeFromRoot = routeFile.replace(projectRoot + '/', '').replace(/\\/g, '/');

      // From __create/route-builder.ts, go up one level to project root, then use the relative path
      importPath = `../${relativeFromRoot}`;

      // Add update query param only in dev for hot reload
      if (import.meta.env.DEV) {
        importPath += `?update=${Date.now()}`;
      }

      if (import.meta.env.DEV) {
        console.log(`[Route Builder] Importing route from: ${importPath} (file: ${routeFile})`);
      }

      let route;
      const importAttempts = [
        importPath,
        routeFile.startsWith('/') ? `file://${routeFile}` : null,
        // Try as relative from project root
        routeFile.replace(process.cwd() + '/', './'),
      ].filter(Boolean) as string[];

      let lastError: Error | null = null;
      for (const attempt of importAttempts) {
        try {
          if (import.meta.env.DEV && attempt !== importPath) {
            console.log(`[Route Builder] Trying alternative import: ${attempt}`);
          }
          route = await import(/* @vite-ignore */ attempt);
          if (import.meta.env.DEV && attempt !== importPath) {
            console.log(`[Route Builder] Successfully imported using: ${attempt}`);
          }
          break;
        } catch (err) {
          lastError = err as Error;
          continue;
        }
      }

      if (!route) {
        console.error(`[Route Builder] Failed to import ${routeFile} after ${importAttempts.length} attempts`);
        console.error(`[Route Builder] Last error:`, lastError);
        throw lastError || new Error(`Could not import route file: ${routeFile}`);
      }

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      for (const method of methods) {
        try {
          if (route[method]) {
            const parts = getHonoPath(routeFile, apiDir);
            const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;

            if (import.meta.env.DEV) {
              console.log(`[Route Builder] Registering ${method} ${honoPath}`);
            }

            const handler: Handler = async (c) => {
              const params = c.req.param();
              if (import.meta.env.DEV) {
                // In dev, re-import for hot reload
                const updatedRoute = await import(/* @vite-ignore */ importPath);
                return await updatedRoute[method](c.req.raw, { params });
              }
              return await route[method](c.req.raw, { params });
            };
            const methodLowercase = method.toLowerCase();
            switch (methodLowercase) {
              case 'get':
                api.get(honoPath, handler);
                break;
              case 'post':
                api.post(honoPath, handler);
                break;
              case 'put':
                api.put(honoPath, handler);
                break;
              case 'delete':
                api.delete(honoPath, handler);
                break;
              case 'patch':
                api.patch(honoPath, handler);
                break;
              default:
                console.warn(`Unsupported method: ${method}`);
                break;
            }
          }
        } catch (error) {
          console.error(`Error registering route ${routeFile} for method ${method}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error importing route file ${routeFile}:`, error);
    }
  }

  if (import.meta.env.DEV) {
    console.log(`[Route Builder] Registered ${api.routes.length} routes`);
    // Log all registered routes for debugging
    api.routes.forEach((route) => {
      console.log(`  - ${route.method} ${API_BASENAME}${route.path}`);
    });
  }
}

// Store the registration promise so it can be awaited if needed
let routesRegistered = false;

// Only run route registration in development
const registrationPromise = import.meta.env.DEV
  ? registerRoutes()
      .then(() => {
        routesRegistered = true;
      })
      .catch((error) => {
        console.error('Failed to register routes:', error);
        routesRegistered = false;
      })
  : Promise.resolve().then(() => {
      console.log('[Route Builder] Skipping auto-registration in production');
      routesRegistered = false; // Routes are manually registered in index.ts
    });

// Export a function to ensure routes are registered
export async function ensureRoutesRegistered() {
  if (!routesRegistered && import.meta.env.DEV) {
    await registrationPromise;
  }
}

// Export a function to get the API app (useful for mounting after routes are registered)
export function getApiApp() {
  return api;
}

// Hot reload routes in development
if (import.meta.env.DEV) {
  import.meta.glob('../src/app/api/**/route.js', {
    eager: true,
  });
  if (import.meta.hot) {
    import.meta.hot.accept((newSelf) => {
      registerRoutes().catch((err) => {
        console.error('Error reloading routes:', err);
      });
    });
  }
}

export { api, API_BASENAME };
