/**
 * ヘルスチェックAPIのテスト
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { healthRoutes } from '../health'

describe('Health Check API', () => {
  let server: FastifyInstance

  beforeAll(async () => {
    server = Fastify().withTypeProvider<ZodTypeProvider>()
    server.setValidatorCompiler(validatorCompiler)
    server.setSerializerCompiler(serializerCompiler)
    await server.register(healthRoutes)
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  it('GET /health - 正常なヘルスチェック', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    })

    expect(response.statusCode).toBe(200)
    const json = response.json()
    expect(json).toHaveProperty('status', 'ok')
    expect(json).toHaveProperty('timestamp')
    expect(json).toHaveProperty('service', 'backend')
    expect(typeof json.timestamp).toBe('string')
  })

  it('GET /health - タイムスタンプが有効なISO形式', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    })

    const json = response.json()
    const timestamp = new Date(json.timestamp)
    expect(timestamp.toString()).not.toBe('Invalid Date')
  })
})
