import Fastify from 'fastify'
import cors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { healthRoutes } from './api/fastify/health'
import { fileTypeRoutes } from './api/fastify/file-type'
import { jobRoutes } from './api/fastify/jobs'
import { initializeApplication } from './core/initializer'
import { RootResponseSchema } from './api/fastify/schemas'

// Fastify server with ZodTypeProvider
const server = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

// Zodのバリデーター・シリアライザーを設定
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Root endpoint
server.get('/', {
  schema: {
    description: 'API情報を取得',
    tags: ['root'],
    response: {
      200: RootResponseSchema,
    },
  },
}, async (request, reply) => {
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

    // Register Swagger/OpenAPI
    await server.register(fastifySwagger, {
      openapi: {
        openapi: '3.1.0',
        info: {
          title: 'File Type Detection API',
          description: 'Fastify API with file type detection and job processing',
          version: '1.0.0',
        },
        servers: [
          {
            url: 'http://localhost:3002',
            description: 'Development server',
          },
        ],
        tags: [
          { name: 'root', description: 'Root endpoints' },
          { name: 'health', description: 'Health check endpoints' },
          { name: 'file-type', description: 'File type detection endpoints' },
          { name: 'jobs', description: 'Job management endpoints' },
        ],
      },
      transform: jsonSchemaTransform,
    })

    // Register Swagger UI
    await server.register(fastifySwaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    })

    // Register Fastify routes
    await server.register(healthRoutes)
    await server.register(fileTypeRoutes, { prefix: '/api' })
    await server.register(jobRoutes, { prefix: '/api' })

    await server.listen({ port: 3002, host: '0.0.0.0' })
    console.log('🚀 API server (Fastify) running at http://localhost:3002')
    console.log('📊 Health check: http://localhost:3002/health')
    console.log('📚 API Documentation: http://localhost:3002/documentation')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

