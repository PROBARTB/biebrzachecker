import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const hosts = (env.VITE_ALLOWED_HOSTS || "")
    .split(",")
    .map(h => h.trim())
    .filter(Boolean)

  return {
    plugins: [react()],
    server: {
      allowedHosts: hosts
    }
  }
})
