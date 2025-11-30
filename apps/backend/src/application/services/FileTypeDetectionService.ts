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
   * Magikaインスタンスを取得（遅延初期化）
   */
  private async getMagikaInstance(): Promise<Magika> {
    if (!magikaInstance) {
      magikaInstance = await Magika.create()
    }
    return magikaInstance
  }

  /**
   * ファイルのタイプを判定する
   */
  async detectFileType(parameter: DetectFileTypeParameter): Promise<FileTypeResult> {
    const magika = await this.getMagikaInstance()
    const prediction = (await magika.identifyBytes(parameter.fileData)) as any

    const outputLabel = prediction.output?.label || 'unknown'
    const isText = prediction.output?.is_text || false
    const score = prediction.score || 0

    return new FileTypeResult(
      parameter.fileName,
      outputLabel,
      isText,
      score,
      `${(score * 100).toFixed(2)}%`,
      `Detected as ${outputLabel} file`
    )
  }
}
