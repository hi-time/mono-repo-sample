import Fastify from 'fastify'
import cors from '@fastify/cors'
import { healthRoutes } from './api/fastify/health'
import { fileTypeRoutes } from './api/fastify/file-type'
import { jobRoutes } from './api/fastify/jobs'
import { initializeApplication } from './core/initializer'

// Fastify server
const server = Fastify({
  logger: true,
})

// Root endpoint
server.get('/', async (request, reply) => {
  return {
    name: 'API Server',
    description: 'Fastify + File Type Detection',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: {
        detectFileType: '/api/detect-file-type',
        jobs: {
          create: '/api/jobs',
          status: '/api/jobs/:jobId/status',
          result: '/api/jobs/:jobId/result',
        },
      },
    },
  }
})

// Start server
const start = async () => {
  try {
    // アプリケーション全体の初期化
    await initializeApplication()

    // Register CORS
    await server.register(cors, {
      origin: true,
    })

    // Register Fastify routes
    await server.register(healthRoutes)
    await server.register(fileTypeRoutes, { prefix: '/api' })
    await server.register(jobRoutes, { prefix: '/api' })

    await server.listen({ port: 3002, host: '0.0.0.0' })
    console.log('🚀 API server (Fastify) running at http://localhost:3002')
    console.log('📊 Health check: http://localhost:3002/health')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

