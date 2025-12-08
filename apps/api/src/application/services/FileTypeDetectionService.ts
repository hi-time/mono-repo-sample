/**
 * ファイルタイプ判定のアプリケーションサービス
 * ビジネスロジックとデータ操作を含む
 */

import { Magika } from 'magika'
import { DetectFileTypeParameter, FileTypeResult } from '../../domain/file-type'

// Magikaインスタンスをキャッシュ（技術的な最適化）
let magikaInstance: Magika | null = null

export class FileTypeDetectionService {
  /**
   * Magikaインスタンスを初期化（サーバー起動時に呼び出す）
   */
  static async initialize(): Promise<void> {
    if (!magikaInstance) {
      console.log('🔧 Initializing Magika...')
      magikaInstance = await Magika.create()
      console.log('✅ Magika initialized successfully')
    }
  }

  /**
   * Magikaインスタンスを取得
   */
  private getMagikaInstance(): Magika {
    if (!magikaInstance) {
      throw new Error('Magika has not been initialized. Call FileTypeDetectionService.initialize() first.')
    }
    return magikaInstance
  }

  /**
   * ファイルのタイプを判定する
   */
  async detectFileType(parameter: DetectFileTypeParameter): Promise<FileTypeResult> {
    const magika = this.getMagikaInstance()
    const result = (await magika.identifyBytes(parameter.fileData)) as any
    
    const outputLabel = result.prediction?.output?.label || 'unknown'
    const isText = result.prediction?.output?.is_text || false
    const score = result.prediction?.score || 0
    const group = result.prediction?.output?.group || 'unknown'
    const mimeType = result.prediction?.output?.mime_type || 'application/octet-stream'
    const extension = result.prediction?.output?.extension || ''

    return new FileTypeResult(
      parameter.fileName,
      outputLabel,
      isText,
      score,
      `${(score * 100).toFixed(2)}%`,
      `Detected as ${outputLabel} file`,
      group,
      mimeType,
      extension
    )
  }
}
