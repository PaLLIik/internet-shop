import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// На GitHub Pages сайт лежит в подпапке /internet-shop/, поэтому пути к файлам строим от неё
// Локально (npm run dev) база остаётся корневой /
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/internet-shop/' : '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
