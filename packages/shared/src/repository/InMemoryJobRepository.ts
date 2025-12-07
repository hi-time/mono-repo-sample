/**
 * ジョブストレージ(Redis/Dragonfly実装)
 * バックエンドとバッチ処理の間でジョブデータを共有
 */

import { JobParameter } from '../job/JobParameter'
import { JobResult } from '../job/JobResult'
import { JobStatus, JobStatusType } from '../job/JobStatus'
import { randomUUID } from 'crypto'
import Redis from 'ioredis'

interface JobData {
  id: string
  parameter: JobParameter
  status: JobStatusType
  result?: JobResult
  error?: string
  createdAt: Date
  updatedAt: Date
}

// Redis接続設定
const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6380', 10)
const JOB_KEY_PREFIX = 'job:'
const JOB_TTL = 24 * 60 * 60 // 24時間

class InMemoryJobRepository {
  private redis: Redis

  constructor() {
    // Redisクライアントを初期化
    this.redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
    })

    this.redis.on('connect', () => {
      console.log(`✅ Connected to Dragonfly/Redis at ${REDIS_HOST}:${REDIS_PORT}`)
    })

    this.redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message)
    })
  }

  /**
   * Redisからジョブデータを取得
   */
  private async getJobData(jobId: string): Promise<JobData | null> {
    const key = `${JOB_KEY_PREFIX}${jobId}`
    const data = await this.redis.get(key)
    
    if (!data) return null

    const parsed = JSON.parse(data)
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
      parameter: new JobParameter(
        new Uint8Array(parsed.parameter.fileData),
        parsed.parameter.fileName
      ),
      result: parsed.result ? new JobResult(
        parsed.result.fileName,
        parsed.result.fileType,
        parsed.result.isText,
        parsed.result.score,
        parsed.result.scorePercent,
        parsed.result.description,
        parsed.result.group,
        parsed.result.mimeType,
        parsed.result.extension
      ) : undefined
    }
  }

  /**
   * Redisにジョブデータを保存
   */
  private async saveJobData(jobData: JobData): Promise<void> {
    const key = `${JOB_KEY_PREFIX}${jobData.id}`
    const serialized = {
      ...jobData,
      parameter: {
        fileData: Array.from(jobData.parameter.fileData),
        fileName: jobData.parameter.fileName
      }
    }
    
    await this.redis.setex(key, JOB_TTL, JSON.stringify(serialized))
  }

  /**
   * 新しいジョブを作成
   */
  async createJob(parameter: JobParameter): Promise<string> {
    const jobId = randomUUID()
    const now = new Date()
    
    const jobData: JobData = {
      id: jobId,
      parameter,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }

    await this.saveJobData(jobData)
    return jobId
  }

  /**
   * ジョブのステータスを取得
   */
  async getJobStatus(jobId: string): Promise<JobStatus | null> {
    const job = await this.getJobData(jobId)
    if (!job) return null

    return new JobStatus(
      job.id,
      job.status,
      job.createdAt,
      job.updatedAt,
      job.error
    )
  }

  /**
   * ジョブの結果を取得
   */
  async getJobResult(jobId: string): Promise<JobResult | null> {
    const job = await this.getJobData(jobId)
    if (!job || job.status !== 'completed') return null
    return job.result || null
  }

  /**
   * ペンディング中のジョブを1件取得
   */
  async getPendingJob(): Promise<{ jobId: string; parameter: JobParameter } | null> {
    // 全てのジョブキーを取得
    const keys = await this.redis.keys(`${JOB_KEY_PREFIX}*`)
    
    for (const key of keys) {
      const jobId = key.replace(JOB_KEY_PREFIX, '')
      const job = await this.getJobData(jobId)
      
      if (job && job.status === 'pending') {
        // ステータスを processing に更新
        job.status = 'processing'
        job.updatedAt = new Date()
        await this.saveJobData(job)
        return { jobId, parameter: job.parameter }
      }
    }
    return null
  }

  /**
   * ジョブを完了状態にする
   */
  async completeJob(jobId: string, result: JobResult): Promise<void> {
    const job = await this.getJobData(jobId)
    if (!job) throw new Error(`Job ${jobId} not found`)

    job.status = 'completed'
    job.result = result
    job.updatedAt = new Date()
    
    await this.saveJobData(job)
  }

  /**
   * ジョブを失敗状態にする
   */
  async failJob(jobId: string, error: string): Promise<void> {
    const job = await this.getJobData(jobId)
    if (!job) throw new Error(`Job ${jobId} not found`)

    job.status = 'failed'
    job.error = error
    job.updatedAt = new Date()
    
    await this.saveJobData(job)
  }

  /**
   * 古いジョブを削除(24時間以上前のもの)
   * Note: RedisのTTLで自動削除されるため、このメソッドは不要だが互換性のため残す
   */
  async cleanupOldJobs(): Promise<void> {
    // RedisのTTLで自動的に削除されるため、何もしない
    console.log('🧹 Old jobs are automatically cleaned up by Redis TTL')
  }

  /**
   * Redis接続をクローズ
   */
  async close(): Promise<void> {
    await this.redis.quit()
  }
}

// シングルトンインスタンス（バックエンドとバッチで共有）
export const jobRepository = new InMemoryJobRepository()
