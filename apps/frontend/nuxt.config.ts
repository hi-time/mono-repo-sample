// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  telemetry: false,
  
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

  // SSG用の設定
  nitro: {
    preset: 'node-server',
    prerender: {
      routes: ['/dashboard', '/dashboard/app-ssg'],
      crawlLinks: true,
    },
  },

  // ルーティング設定
  router: {
    options: {
      strict: false,
    },
  },

  compatibilityDate: '2024-11-30',
})
