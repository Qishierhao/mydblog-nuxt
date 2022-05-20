import {defineNuxtConfig} from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  css: [
    'normalize.css/normalize.css',
    'assets/css/tailwind.css'
  ],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        }
      }
    }
  },
  buildModules: ['@nuxtjs/tailwindcss']
})