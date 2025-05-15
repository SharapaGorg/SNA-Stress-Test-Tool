import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    root: 'client',
    build: {
        outDir: '../dist/client',
        emptyOutDir: true
    },
    css: {},
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            },
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true
            }
        }
    }
});
