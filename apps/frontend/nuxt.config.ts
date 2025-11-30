// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      title: 'Nuxt DDD Sample',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Turborepo monorepo sample with Nuxt, Hono, and DDD' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3002',
    },
  },

  compatibilityDate: '2024-11-30',
})
