import { defineConfig } from 'vite';
import laravel, { refreshPaths } from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/react/index.tsx',
                'resources/react/progress.tsx',
            ],
            refresh: [
                ...refreshPaths,
                'app/Http/Livewire/**',
                'resources/react/components/**',
            ],
        }),
        react(),
    ],
    server: {
        host: true,
        hmr: {
            host: 'localhost',
        },
    },
    resolve: {
        alias: {
            '~': '/resources/react',
            functions: '/resources/react/functions',
            components: '/resources/react/components',
            models: '/resources/react/models',
            mocks: '/resources/react/mocks',
        },
    },
    build: {
        manifest: true,
    }
});
