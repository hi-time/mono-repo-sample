import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { HealthResponseSchema } from './schemas'

export async function healthRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>()

  server.get('/health', {
    schema: {
      description: 'ヘルスチェックエンドポイント',
      tags: ['health'],
      response: {
        200: HealthResponseSchema,
      },
    },
  }, async (request, reply) => {
    return {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      service: 'backend',
    }
  })
}
