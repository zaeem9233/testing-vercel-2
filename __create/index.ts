import { AsyncLocalStorage } from 'node:async_hooks';
import nodeConsole from 'node:console';
import { skipCSRFCheck } from '@auth/core';
import Credentials from '@auth/core/providers/credentials';
import { authHandler, initAuthConfig } from '@hono/auth-js';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { hash, verify } from 'argon2';
import { Hono } from 'hono';
import { contextStorage, getContext } from 'hono/context-storage';
import { cors } from 'hono/cors';
import { proxy } from 'hono/proxy';
import { bodyLimit } from 'hono/body-limit';
import { requestId } from 'hono/request-id';
import { createHonoServer } from 'react-router-hono-server/node';
import { serializeError } from 'serialize-error';
import ws from 'ws';
import NeonAdapter from './adapter';
import { getHTMLForErrorPage } from './get-html-for-error-page';
import { isAuthAction } from './is-auth-action';
import { API_BASENAME, api } from './route-builder';
import { auth as getAuth } from '../src/auth.js';
neonConfig.webSocketConstructor = ws;

const als = new AsyncLocalStorage<{ requestId: string }>();

for (const method of ['log', 'info', 'warn', 'error', 'debug'] as const) {
  const original = nodeConsole[method].bind(console);

  console[method] = (...args: unknown[]) => {
    const requestId = als.getStore()?.requestId;
    if (requestId) {
      original(`[traceId:${requestId}]`, ...args);
    } else {
      original(...args);
    }
  };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = NeonAdapter(pool);

const app = new Hono();

app.use('*', requestId());

app.use('*', (c, next) => {
  const requestId = c.get('requestId');
  return als.run({ requestId }, () => next());
});

app.use(contextStorage());

// Log all incoming requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use('*', async (c, next) => {
    console.log(`[Request] ${c.req.method} ${c.req.url}`);
    await next();
    console.log(`[Response] ${c.req.method} ${c.req.url} - Status: ${c.res.status}`);
  });
}

app.onError((err, c) => {
  if (c.req.method !== 'GET') {
    return c.json(
      {
        error: 'An error occurred in your app',
        details: serializeError(err),
      },
      500
    );
  }
  return c.html(getHTMLForErrorPage(err), 200);
});

if (process.env.CORS_ORIGINS) {
  app.use(
    '/*',
    cors({
      origin: process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    })
  );
}
for (const method of ['post', 'put', 'patch'] as const) {
  app[method](
    '*',
    bodyLimit({
      maxSize: 4.5 * 1024 * 1024, // 4.5mb to match vercel limit
      onError: (c) => {
        return c.json({ error: 'Body size limit exceeded' }, 413);
      },
    })
  );
}

if (process.env.AUTH_SECRET) {
  app.use(
    '*',
    initAuthConfig((c) => ({
      secret: c.env.AUTH_SECRET,
      trustHost: true,
      basePath: '/api/auth',
      pages: {
        signIn: '/account/signin',
        signOut: '/account/logout',
      },
      skipCSRFCheck: skipCSRFCheck,
      session: {
        strategy: 'jwt',
      },
      callbacks: {
        session({ session, token }) {
          if (token.sub) {
            session.user.id = token.sub;
          }
          return session;
        },
      },
      cookies: {
        csrfToken: {
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          },
        },
        sessionToken: {
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          },
        },
        callbackUrl: {
          options: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          },
        },
      },
      providers: [
        Credentials({
          id: 'credentials-signin',
          name: 'Credentials Sign in',
          credentials: {
            email: {
              label: 'Email',
              type: 'email',
            },
            password: {
              label: 'Password',
              type: 'password',
            },
          },
          authorize: async (credentials) => {
            try {
              const { email, password } = credentials;
              if (!email || !password) {
                return null;
              }
              if (typeof email !== 'string' || typeof password !== 'string') {
                return null;
              }

              const user = await adapter.getUserByEmail(email);
              if (!user) {
                return null;
              }
              const matchingAccount = user.accounts.find(
                (account) => account.provider === 'credentials'
              );
              const accountPassword = matchingAccount?.password;
              if (!accountPassword) {
                return null;
              }

              const isValid = await verify(accountPassword, password);
              if (!isValid) {
                return null;
              }

              return user;
            } catch (error) {
              console.error('[AUTH SIGNIN ERROR]:', error);
              return null;
            }
          },
        }),
        Credentials({
          id: 'credentials-signup',
          name: 'Credentials Sign up',
          credentials: {
            email: {
              label: 'Email',
              type: 'email',
            },
            password: {
              label: 'Password',
              type: 'password',
            },
            name: { label: 'Name', type: 'text', required: false },
            image: { label: 'Image', type: 'text', required: false },
          },
          authorize: async (credentials) => {
            try {
              console.log('[AUTH SIGNUP] Starting signup process...');
              const { email, password, name, image } = credentials;
              
              if (!email || !password) {
                console.error('[AUTH SIGNUP] Missing credentials');
                return null;
              }
              if (typeof email !== 'string' || typeof password !== 'string') {
                console.error('[AUTH SIGNUP] Invalid credential types');
                return null;
              }

              console.log('[AUTH SIGNUP] Checking for existing user:', email);
              const existingUser = await adapter.getUserByEmail(email);
              if (existingUser) {
                console.error('[AUTH SIGNUP] User already exists');
                return null;
              }

              console.log('[AUTH SIGNUP] Creating new user...');
              const newUser = await adapter.createUser({
                id: crypto.randomUUID(),
                emailVerified: null,
                email,
                name: typeof name === 'string' && name.length > 0 ? name : email.split('@')[0],
                image: typeof image === 'string' && image.length > 0 ? image : undefined,
              });
              
              console.log('[AUTH SIGNUP] User created, ID:', newUser.id);
              console.log('[AUTH SIGNUP] Hashing password...');
              const hashedPassword = await hash(password);
              
              console.log('[AUTH SIGNUP] Linking account...');
              await adapter.linkAccount({
                extraData: {
                  password: hashedPassword,
                },
                type: 'credentials',
                userId: newUser.id,
                providerAccountId: newUser.id,
                provider: 'credentials',
              });
              
              console.log('[AUTH SIGNUP] Success! User:', newUser.email);
              return newUser;
            } catch (error) {
              console.error('[AUTH SIGNUP ERROR]:', error);
              return null;
            }
          },
        }),
      ],
    }))
  );
}

app.all('/integrations/:path{.+}', async (c, next) => {
  const queryParams = c.req.query();
  const url = `${process.env.NEXT_PUBLIC_CREATE_BASE_URL ?? 'https://www.create.xyz'}/integrations/${c.req.param('path')}${Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : ''}`;

  return proxy(url, {
    method: c.req.method,
    body: c.req.raw.body ?? null,
    // @ts-ignore - this key is accepted even if types not aware and is
    // required for streaming integrations
    duplex: 'half',
    redirect: 'manual',
    headers: {
      ...c.req.header(),
      'X-Forwarded-For': process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-host': process.env.NEXT_PUBLIC_CREATE_HOST,
      Host: process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-project-group-id': process.env.NEXT_PUBLIC_PROJECT_GROUP_ID,
    },
  });
});

app.use('/api/auth/*', async (c, next) => {
  if (isAuthAction(c.req.path)) {
    return authHandler()(c, next);
  }
  return next();
});

// Test: Directly register the videos route to see if it works
app.get('/api/videos', async (c) => {
  console.log('[API] GET /api/videos called');
  try {
    const session = await getAuth();
    console.log('[API] Session:', session);
    
    if (!session || !session.user?.id) {
      console.log('[API] No valid session found');
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    console.log('[API] User ID:', userId);
    
    const videos = await pool.query(
      'SELECT id, title, description, prompt, video_url, thumbnail_url, status, quality, created_at FROM videos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return c.json({ videos: videos.rows });
  } catch (error) {
    console.error("Get videos error:", error);
    return c.json({ error: "Failed to fetch videos" }, 500);
  }
});

app.post('/api/videos', async (c) => {
  console.log('[API] POST /api/videos called');
  try {
    const session = await getAuth();
    console.log('[API] Session:', session);
    
    if (!session || !session.user?.id) {
      console.log('[API] No valid session found');
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const body = await c.req.json();
    const { title, description, prompt, quality } = body;

    if (!title || !prompt) {
      return c.json({ error: "Title and prompt are required" }, 400);
    }

    const result = await pool.query(
      'INSERT INTO videos (user_id, title, description, prompt, quality, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, prompt, status, quality, created_at',
      [userId, title, description || null, prompt, quality || "1080p", 'processing']
    );

    return c.json({ video: result.rows[0] });
  } catch (error) {
    console.error("Create video error:", error);
    return c.json({ error: "Failed to create video" }, 500);
  }
});

// CRM Contacts routes
app.get('/api/crm/contacts', async (c) => {
  console.log('[API] GET /api/crm/contacts called');
  try {
    const session = await getAuth();
    if (!session || !session.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';

    let query = 'SELECT id, name, email, phone, company, position, status, notes, created_at, updated_at FROM crm_contacts WHERE user_id = $1';
    const values: any[] = [userId];
    let paramCount = 1;

    if (search) {
      paramCount++;
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(email) LIKE LOWER($${paramCount}) OR LOWER(company) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return c.json({ contacts: result.rows });
  } catch (error) {
    console.error("Get contacts error:", error);
    return c.json({ error: "Failed to fetch contacts" }, 500);
  }
});

app.post('/api/crm/contacts', async (c) => {
  console.log('[API] POST /api/crm/contacts called');
  try {
    const session = await getAuth();
    if (!session || !session.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const body = await c.req.json();
    const { name, email, phone, company, position, status, notes } = body;

    if (!name || !email) {
      return c.json({ error: "Name and email are required" }, 400);
    }

    const result = await pool.query(
      'INSERT INTO crm_contacts (user_id, name, email, phone, company, position, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, phone, company, position, status, notes, created_at, updated_at',
      [userId, name, email, phone || null, company || null, position || null, status || 'lead', notes || null]
    );

    return c.json({ contact: result.rows[0] });
  } catch (error) {
    console.error("Create contact error:", error);
    return c.json({ error: "Failed to create contact" }, 500);
  }
});

app.put('/api/crm/contacts/:id', async (c) => {
  console.log('[API] PUT /api/crm/contacts/:id called');
  try {
    const session = await getAuth();
    if (!session || !session.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const contactId = c.req.param('id');
    const body = await c.req.json();
    const { name, email, phone, company, position, status, notes } = body;

    if (!name || !email) {
      return c.json({ error: "Name and email are required" }, 400);
    }

    const result = await pool.query(
      'UPDATE crm_contacts SET name = $1, email = $2, phone = $3, company = $4, position = $5, status = $6, notes = $7, updated_at = NOW() WHERE id = $8 AND user_id = $9 RETURNING id, name, email, phone, company, position, status, notes, created_at, updated_at',
      [name, email, phone || null, company || null, position || null, status, notes || null, contactId, userId]
    );

    if (result.rows.length === 0) {
      return c.json({ error: "Contact not found" }, 404);
    }

    return c.json({ contact: result.rows[0] });
  } catch (error) {
    console.error("Update contact error:", error);
    return c.json({ error: "Failed to update contact" }, 500);
  }
});

app.delete('/api/crm/contacts/:id', async (c) => {
  console.log('[API] DELETE /api/crm/contacts/:id called');
  try {
    const session = await getAuth();
    if (!session || !session.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = session.user.id;
    const contactId = c.req.param('id');

    const result = await pool.query(
      'DELETE FROM crm_contacts WHERE id = $1 AND user_id = $2 RETURNING id',
      [contactId, userId]
    );

    if (result.rows.length === 0) {
      return c.json({ error: "Contact not found" }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete contact error:", error);
    return c.json({ error: "Failed to delete contact" }, 500);
  }
});

// Import route builder
import { ensureRoutesRegistered, getApiApp } from './route-builder';

// Check if we're in build mode (Vite sets this during SSR build)
const isBuild = process.argv.includes('build') || process.env.VITE_BUILD === 'true';

export default (async () => {
  // Skip route-builder in production since routes are manually registered
  if (import.meta.env.DEV) {
    await ensureRoutesRegistered().catch((err) => {
      console.error('[Server] Route registration failed:', err);
    });
    
    const apiApp = getApiApp();
    app.route(API_BASENAME, apiApp);
    
    console.log(`[Server] API routes mounted at ${API_BASENAME}`);
    console.log(`[Server] API routes registered: ${apiApp.routes.length}`);
    apiApp.routes.forEach((route) => {
      console.log(`  - ${route.method} ${API_BASENAME}${route.path}`);
    });
  } else {
    console.log('[Server] Using manually registered routes in production');
  }
  
  // During build, just return the app config without starting the server
  if (isBuild) {
    console.log('[Server] Build mode detected, skipping server start');
    return app;
  }
  
  return await createHonoServer({
    app,
    defaultLogger: false,
  });
})();
