// server.js
import('./build/server/index.js')
  .then(async (module) => {
    const server = await module.default;
    console.log('✅ Server initialized successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });