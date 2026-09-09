import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so the CI build sets GITHUB_PAGES=true to make asset URLs resolve under
// that subpath. Local dev and other hosts (Vercel, Netlify, etc.) keep the
// default root base.
const base = process.env.GITHUB_PAGES ? '/EV-Charging-Calculator/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
