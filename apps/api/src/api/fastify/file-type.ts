/**
 * ファイルタイプ判定のFastifyルート
 * API層 - ルーティング
 */

import type { FastifyPluginAsync } from 'fastify'
import multipart from '@fastify/multipart'
import { FileTypeDetectionService } from '../../application/services/FileTypeDetectionService'
import { DetectFileTypeParameter } from '../../domain/file-type'

export const fileTypeRoutes: FastifyPluginAsync = async (server) => {
  // マルチパートプラグインを登録
  await server.register(multipart)

  // サービスのインスタンスを作成
  const fileTypeDetectionService = new FileTypeDetectionService()

  /**
   * POST /api/detect-file-type
   * ファイルタイプを判定するエンドポイント
   */
  server.post('/detect-file-type', async (request, reply) => {
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

      // パラメータを作成
      const parameter = new DetectFileTypeParameter(uint8Array, data.filename)

      // アプリケーションサービスを呼び出し
      const result = await fileTypeDetectionService.detectFileType(parameter)

      console.log('File type detection result:', result)

      return reply.send(result)
    } catch (error) {
      server.log.error(error)
      return reply.status(500).send({
        error: 'ファイル分析中にエラーが発生しました',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  })
}
