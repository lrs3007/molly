import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/', server: { port: 5174, strictPort: true },build:{rollupOptions:{output:{manualChunks(id){
 if(id.includes('node_modules/'))return 'vendor';
 const book=id.match(/curriculum\/level([123])\.json/);if(book)return `curriculum-${book[1]}`;
 if(id.includes('audio-playback.json'))return 'lesson-audio';
}}}} });
