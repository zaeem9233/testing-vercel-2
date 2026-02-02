import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: true,
	// Prerender only the root route, not the catch-all 404 route
	// The catch-all route has a loader that scans filesystem and doesn't need prerendering
	prerender: ['/'],
} satisfies Config;
