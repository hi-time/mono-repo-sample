import Fastify from 'fastify'
import cors from '@fastify/cors'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { ordersRoutes } from './api/fastify/orders'
import { healthRoutes } from './api/fastify/health'
import { usersRoute } from './api/hono/users'
import { productsRoute } from './api/hono/products'

// Fastify server for DDD backend
const server = Fastify({
  logger: true,
})

// Register CORS
await server.register(cors, {
  origin: true,
})

// Register Fastify routes (orders with DDD)
await server.register(healthRoutes)
await server.register(ordersRoutes, { prefix: '/api' })

// Root endpoint
server.get('/', async (request, reply) => {
  return {
    name: 'Unified API Server',
    description: 'Fastify + Hono + OpenAPI + DDD',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/docs',
      openapi: '/openapi.json',
      api: {
        users: '/api/users',
        products: '/api/products',
        orders: '/api/orders',
      },
    },
  }
})

// Hono + OpenAPI routes (users, products)
const honoApp = new OpenAPIHono()

// Register Hono routes
honoApp.route('/api/users', usersRoute)
honoApp.route('/api/products', productsRoute)

// OpenAPI documentation
honoApp.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Unified API (Fastify + Hono)',
    description: 'API with Fastify (DDD) and Hono (OpenAPI)',
  },
})

// Swagger UI
honoApp.get('/docs', swaggerUI({ url: '/openapi.json' }))

// Mount Hono as Fastify handler
server.all('/api/users/*', async (request, reply) => {
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

server.all('/api/products/*', async (request, reply) => {
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

// Start server
const start = async () => {
  try {
    await server.listen({ port: 3002, host: '0.0.0.0' })
    console.log('🚀 Unified API server (Fastify + Hono) running at http://localhost:3002')
    console.log('📚 API docs (Swagger): http://localhost:3002/docs')
    console.log('📄 OpenAPI spec: http://localhost:3002/openapi.json')
    console.log('📊 Health check: http://localhost:3002/health')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
