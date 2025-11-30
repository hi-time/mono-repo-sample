import type { FastifyPluginAsync } from 'fastify'
// @ts-expect-error - @fastify/multipart v8 doesn't include type definitions
import multipart from '@fastify/multipart'
import { Magika } from 'magika'

// Magikaインスタンスをキャッシュ
let magikaInstance: Magika | null = null

const getMagikaInstance = async () => {
  if (!magikaInstance) {
    magikaInstance = await Magika.create()
  }
  return magikaInstance
}

export const detectMimeRoutes: FastifyPluginAsync = async (server) => {
  // マルチパートプラグインを登録
  await server.register(multipart)

  server.post('/detect-mime', async (request, reply) => {
    try {
      // @ts-ignore - multipart plugin adds file() method
      const data = await request.file()
      
      if (!data) {
        return reply.status(400).send({
          error: 'ファイルがアップロードされていません',
        })
      }

      // ファイルデータをBufferとして取得
      const buffer = await data.toBuffer()
      const uint8Array = new Uint8Array(buffer)

      // Magikaでファイルタイプを判定
      const magika = await getMagikaInstance()
      const prediction = await magika.identifyBytes(uint8Array) as any

      const outputLabel = prediction.output?.label || 'unknown'
      const isText = prediction.output?.is_text || false
      const score = prediction.score || 0

      return reply.send({
        fileName: data.filename,
        fileType: outputLabel,
        isText: isText,
        score: score,
        scorePercent: `${(score * 100).toFixed(2)}%`,
        description: `Detected as ${outputLabel} file`,
      })
    } catch (error) {
      server.log.error(error)
      return reply.status(500).send({
        error: 'ファイル分析中にエラーが発生しました',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  })
}
