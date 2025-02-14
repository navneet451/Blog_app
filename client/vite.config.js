import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://blog-app-backend-o0wt.onrender.com", // Use the deployed backend URL
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
