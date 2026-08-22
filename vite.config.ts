import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const exitServerPlugin = (): Plugin => ({
  name: 'exit-server-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.startsWith('/api/exit')) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ success: true, message: 'Server is terminating...' }));
        console.log('Received exit request from client. Terminating game server process...');
        setTimeout(() => {
          process.exit(0);
        }, 500);
        return;
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.startsWith('/api/exit')) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ success: true, message: 'Preview server is terminating...' }));
        console.log('Received exit request from client. Terminating preview process...');
        setTimeout(() => {
          process.exit(0);
        }, 500);
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), exitServerPlugin()],
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173
  }
});
