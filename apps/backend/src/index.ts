import Fastify from 'fastify'
import cors from '@fastify/cors'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { healthRoutes } from './api/fastify/health'
import { fileTypeRoutes } from './api/fastify/file-type'
import { fileTypeRoute } from './api/hono/file-type'
import { initializeApplication } from './core/initializer'

// Fastify server
const server = Fastify({
  logger: true,
})

// Hono + OpenAPI routes
const honoApp = new OpenAPIHono()

// Register Hono routes
honoApp.route('/api/file-type', fileTypeRoute)

// OpenAPI documentation
honoApp.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'File Type Detection API',
    description: 'API for detecting file types using Google Magika',
  },
})

// Swagger UI
honoApp.get('/docs', swaggerUI({ url: '/openapi.json' }))

// Mount Hono as Fastify handler
server.all('/api/file-type/*', async (request, reply) => {
  const response = await honoApp.fetch(
    new Request(`http://localhost${request.url}`, {
      method: request.method,
      headers: request.headers as any,
      body: request.body as any,
    })
  )
  
  reply.status(response.status)
  response.headers.forEach((value, key) => {
    reply.header(key, value)
  })
  
  return reply.send(await response.text())
})

server.get('/docs', async (request, reply) => {
  const response = await honoApp.fetch(
    new Request(`http://localhost${request.url}`, {
      method: request.method,
      headers: request.headers as any,
    })
  )
  
  reply.status(response.status)
  response.headers.forEach((value, key) => {
    reply.header(key, value)
  })
  
  return reply.send(await response.text())
})

server.get('/openapi.json', async (request, reply) => {
  const response = await honoApp.fetch(
    new Request(`http://localhost${request.url}`, {
      method: request.method,
      headers: request.headers as any,
    })
  )
  
  reply.status(response.status)
  response.headers.forEach((value, key) => {
    reply.header(key, value)
  })
  
  return reply.send(await response.text())
})

// Root endpoint
server.get('/', async (request, reply) => {
  return {
    name: 'API Server',
    description: 'Fastify + Hono + File Type Detection',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/docs',
      openapi: '/openapi.json',
      api: {
        fastify: {
          detectFileType: '/api/detect-file-type',
        },
        hono: {
          detectFileType: '/api/file-type/detect-file-type',
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

    await server.listen({ port: 3002, host: '0.0.0.0' })
    console.log('🚀 API server (Fastify + Hono) running at http://localhost:3002')
    console.log('📚 API docs (Swagger): http://localhost:3002/docs')
    console.log('📄 OpenAPI spec: http://localhost:3002/openapi.json')
    console.log('📊 Health check: http://localhost:3002/health')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

