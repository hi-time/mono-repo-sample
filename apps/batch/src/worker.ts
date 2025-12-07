/**
 * バッチワーカー
 * ペンディング中のジョブをポーリングして実行
 */

import { jobRepository, JobResult } from '@repo/shared'
import { Magika } from 'magika'

// Magikaインスタンス
let magikaInstance: Magika | null = null

/**
 * Magikaを初期化
 */
async function initializeMagika(): Promise<void> {
  if (!magikaInstance) {
    console.log('Initializing Magika...')
    magikaInstance = await Magika.create()
    console.log('Magika initialized successfully')
  }
}

const POLLING_INTERVAL = 1000 // 1秒ごとにポーリング
const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1時間ごとにクリーンアップ

/**
 * ペンディング中のジョブを処理
 */
async function processJobs() {
  // ペンディング中のジョブを1件取得
  const job = await jobRepository.getPendingJob()

  if (!job) {
    // ジョブがない場合は何もしない
    return
  }

  console.log(`🔄 Processing job ${job.jobId}...`)

  try {
    if (!magikaInstance) {
      throw new Error('Magika not initialized')
    }

    // Magikaでファイルタイプを検出
    const identifyResult = await magikaInstance.identifyBytes(job.parameter.fileData) as any
    const output = identifyResult.prediction?.output
    const scoreMap = identifyResult.prediction?.score || {}

    if (!output) {
      throw new Error('Failed to detect file type')
    }

    // スコアを計算
    const score = scoreMap[output.label] ?? 0
    const scorePercent = `${Math.round(score * 100)}%`

    // ジョブ結果を作成
    const jobResult = new JobResult(
      job.parameter.fileName,
      output.label || 'unknown',
      output.is_text || false,
      score,
      scorePercent,
      output.description || '',
      output.group || 'unknown',
      output.mime_type || 'application/octet-stream',
      Array.isArray(output.extensions) ? output.extensions.join(', ') : output.extension || ''
    )

    // ジョブを完了状態にする
    await jobRepository.completeJob(job.jobId, jobResult)

    console.log(`✅ Job ${job.jobId} completed successfully`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`❌ Job ${job.jobId} failed:`, errorMessage)

    // ジョブを失敗状態にする
    await jobRepository.failJob(job.jobId, errorMessage)
  }
}

/**
 * ワーカーを起動
 */
async function startWorker() {
  console.log('🚀 Batch worker started')

  // Magikaを初期化
  await initializeMagika()

  // 定期的にジョブをポーリング
  setInterval(async () => {
    try {
      await processJobs()
    } catch (error) {
      console.error('Worker error:', error)
    }
  }, POLLING_INTERVAL)

  // 定期的に古いジョブをクリーンアップ
  setInterval(async () => {
    console.log('🧹 Cleaning up old jobs...')
    await jobRepository.cleanupOldJobs()
  }, CLEANUP_INTERVAL)

  console.log(`⏱️  Polling interval: ${POLLING_INTERVAL}ms`)
}

// ワーカーを起動
startWorker().catch((error) => {
  console.error('Failed to start worker:', error)
  process.exit(1)
})
