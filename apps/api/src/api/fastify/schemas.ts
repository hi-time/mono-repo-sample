/**
 * APIエンドポイントのZodスキーマ定義
 * OpenAPI生成用
 */

import { z } from 'zod'

// ヘルスチェック
export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  service: z.string(),
})

// ファイルタイプ検出
export const FileTypeResponseSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  isText: z.boolean(),
  score: z.number(),
  scorePercent: z.string(),
  description: z.string(),
  group: z.string(),
  mimeType: z.string(),
  extension: z.string(),
})

export const FileTypeErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
})

// ジョブ投入
export const JobCreateResponseSchema = z.object({
  jobId: z.string(),
  message: z.string(),
})

export const JobCreateErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
})

// ジョブステータス
export const JobStatusParamsSchema = z.object({
  jobId: z.string(),
})

export const JobStatusResponseSchema = z.object({
  jobId: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  createdAt: z.string(),
  updatedAt: z.string(),
  error: z.string().optional(),
})

export const JobStatusErrorSchema = z.object({
  error: z.string(),
})

// ジョブ結果
export const JobResultParamsSchema = z.object({
  jobId: z.string(),
})

export const JobResultResponseSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  isText: z.boolean(),
  score: z.number(),
  scorePercent: z.string(),
  description: z.string(),
  group: z.string(),
  mimeType: z.string(),
  extension: z.string(),
})

export const JobResultErrorSchema = z.object({
  error: z.string(),
})

// ルートエンドポイント
export const RootResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  endpoints: z.object({
    health: z.string(),
    api: z.object({
      detectFileType: z.string(),
      jobs: z.object({
        create: z.string(),
        status: z.string(),
        result: z.string(),
      }),
    }),
  }),
})
