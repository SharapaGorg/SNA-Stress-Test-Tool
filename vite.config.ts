// @ts-ignore
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: 'client',
    build: {
        outDir: path.resolve(__dirname, "dist/public"),
    },
    server: {
        strictPort: true,
        proxy: {
            // Forward API requests to the backend during development
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            },
            // For websocket connections
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true
            }
        }
    }
});
