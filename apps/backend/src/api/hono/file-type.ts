/**
 * ファイルタイプ判定のHonoルート
 * API層 - ルーティング（Fastify版の機能を呼び出す）
 */

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { FileTypeDetectionService } from '../../application/services/FileTypeDetectionService'
import { DetectFileTypeParameter } from '../../domain/file-type'

const app = new OpenAPIHono()

// サービスのインスタンスを作成
const fileTypeDetectionService = new FileTypeDetectionService()

// OpenAPIスキーマ定義
const FileTypeResultSchema = z.object({
  fileName: z.string().openapi({ description: 'アップロードされたファイル名' }),
  fileType: z.string().openapi({ description: '検出されたファイルタイプ' }),
  isText: z.boolean().openapi({ description: 'テキストファイルかどうか' }),
  score: z.number().openapi({ description: '信頼度スコア（0-1）' }),
  scorePercent: z.string().openapi({ description: '信頼度スコア（パーセント表示）' }),
  description: z.string().openapi({ description: 'ファイルタイプの説明' }),
})

const ErrorSchema = z.object({
  error: z.string().openapi({ description: 'エラーメッセージ' }),
  message: z.string().optional().openapi({ description: '詳細なエラー情報' }),
})

// ファイルタイプ判定エンドポイント
const detectFileTypeRoute = createRoute({
  method: 'post',
  path: '/detect-file-type',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.any().openapi({ type: 'string', format: 'binary' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: FileTypeResultSchema,
        },
      },
      description: 'ファイルタイプ判定結果',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'リクエストエラー',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'サーバーエラー',
    },
  },
  tags: ['File Type Detection'],
})

app.openapi(detectFileTypeRoute, async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body['file']

    if (!file || !(file instanceof File)) {
      return c.json(
        {
          error: 'ファイルがアップロードされていません',
        },
        400
      )
    }

    // ファイルデータをUint8Arrayに変換
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // パラメータを作成
    const parameter = new DetectFileTypeParameter(uint8Array, file.name)

    // アプリケーションサービスを呼び出し（Fastify版と同じサービス）
    const result = await fileTypeDetectionService.detectFileType(parameter)

    return c.json(result, 200)
  } catch (error) {
    console.error(error)
    return c.json(
      {
        error: 'ファイル分析中にエラーが発生しました',
        message: error instanceof Error ? error.message : String(error),
      },
      500
    )
  }
})

export const fileTypeRoute: OpenAPIHono = app
