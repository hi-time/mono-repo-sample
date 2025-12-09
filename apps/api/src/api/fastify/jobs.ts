/**
 * ジョブ管理のFastifyルート
 * API層 - ジョブの投入、ステータス確認、結果取得
 */

import type { FastifyPluginAsync } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import multipart from '@fastify/multipart'
import { jobRepository } from '@repo/shared'
import { JobParameter } from '@repo/shared'
import {
  JobCreateResponseSchema,
  JobCreateErrorSchema,
  JobStatusParamsSchema,
  JobStatusResponseSchema,
  JobStatusErrorSchema,
  JobResultParamsSchema,
  JobResultResponseSchema,
  JobResultErrorSchema,
} from './schemas'

export const jobRoutes: FastifyPluginAsync = async (server) => {
  const typedServer = server.withTypeProvider<ZodTypeProvider>()

  // マルチパートプラグインを登録（ファイルサイズ制限を100MBに設定）
  await server.register(multipart, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB
      files: 1,
    }
  })

  /**
   * POST /api/jobs
   * ジョブを投入してジョブIDを即座に返す
   */
  typedServer.post('/jobs', {
    schema: {
      description: '新しいジョブを投入',
      tags: ['jobs'],
      consumes: ['multipart/form-data'],
      response: {
        202: JobCreateResponseSchema,
        400: JobCreateErrorSchema,
        500: JobCreateErrorSchema,
      },
    },
  }, async (request, reply) => {
    try {
      // @ts-ignore - multipart plugin adds file() method
      const data = await request.file()

      if (!data) {
        return reply.status(400).send({
          error: 'ファイルがアップロードされていません',
        })
      }

      // ファイルデータをUint8Arrayに変換
      const buffer = await data.toBuffer()
      const uint8Array = new Uint8Array(buffer)

      // ジョブパラメータを作成
      const parameter = new JobParameter(uint8Array, data.filename)

      // ジョブを作成（ペンディング状態）
      const jobId = await jobRepository.createJob(parameter)

      return reply.status(202).send({
        jobId,
        message: 'ジョブを投入しました',
      })
    } catch (error) {
      server.log.error(error)
      return reply.status(500).send({
        error: 'ジョブ投入中にエラーが発生しました',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  })

  /**
   * GET /api/jobs/:jobId/status
   * ジョブのステータスを確認
   */
  typedServer.get('/jobs/:jobId/status', {
    schema: {
      description: 'ジョブのステータスを確認',
      tags: ['jobs'],
      params: JobStatusParamsSchema,
      response: {
        200: JobStatusResponseSchema,
        404: JobStatusErrorSchema,
      },
    },
  }, async (request, reply) => {
    const { jobId } = request.params

    const status = await jobRepository.getJobStatus(jobId)

    if (!status) {
      return reply.status(404).send({
        error: 'ジョブが見つかりません',
      })
    }

    return reply.send({
      jobId: status.jobId,
      status: status.status,
      createdAt: status.createdAt.toISOString(),
      updatedAt: status.updatedAt.toISOString(),
      error: status.error,
    })
  })

  /**
   * GET /api/jobs/:jobId/result
   * ジョブの結果を取得
   */
  typedServer.get('/jobs/:jobId/result', {
    schema: {
      description: 'ジョブの結果を取得',
      tags: ['jobs'],
      params: JobResultParamsSchema,
      response: {
        200: JobResultResponseSchema,
        400: JobResultErrorSchema,
        404: JobResultErrorSchema,
        500: JobResultErrorSchema,
      },
    },
  }, async (request, reply) => {
    const { jobId } = request.params

    // まずステータスを確認
    const status = await jobRepository.getJobStatus(jobId)

    if (!status) {
      return reply.status(404).send({
        error: 'ジョブが見つかりません',
      })
    }

    if (status.status === 'pending' || status.status === 'processing') {
      return reply.status(400).send({
        error: 'ジョブはまだ完了していません',
      })
    }

    if (status.status === 'failed') {
      return reply.status(500).send({
        error: 'ジョブが失敗しました',
      })
    }

    // 結果を取得
    const result = await jobRepository.getJobResult(jobId)

    if (!result) {
      return reply.status(500).send({
        error: '結果の取得に失敗しました',
      })
    }

    return reply.send(result)
  })
}
