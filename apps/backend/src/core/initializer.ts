/**
 * アプリケーション初期化処理
 * サーバー起動時に必要な初期化をまとめて実行する
 */

import { FileTypeDetectionService } from '../application/services/FileTypeDetectionService'

/**
 * アプリケーション全体の初期化処理
 */
export async function initializeApplication(): Promise<void> {
  console.log('🚀 Initializing application...')

  // Magikaの初期化
  await FileTypeDetectionService.initialize()

  // 将来的に追加される初期化処理をここに追加
  // 例: データベース接続、キャッシュ初期化、外部サービス接続など

  console.log('✅ Application initialized successfully')
}
