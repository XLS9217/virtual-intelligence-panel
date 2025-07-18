import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND_HOST = "172.16.16.202:8192"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    cors: true,
    host: true
  },
  
  define: {
    __BACKEND_HOST__: JSON.stringify(BACKEND_HOST)
  }
})
