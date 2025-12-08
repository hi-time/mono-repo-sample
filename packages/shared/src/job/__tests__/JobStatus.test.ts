/**
 * JobStatusのテスト
 */

import { describe, it, expect } from 'vitest'
import { JobStatus } from '../JobStatus'

describe('JobStatus', () => {
  it('正しいプロパティで初期化される', () => {
    const jobId = '550e8400-e29b-41d4-a716-446655440000'
    const status = 'pending'
    const createdAt = new Date('2025-12-08T00:00:00.000Z')
    const updatedAt = new Date('2025-12-08T00:00:01.000Z')

    const jobStatus = new JobStatus(jobId, status, createdAt, updatedAt)

    expect(jobStatus.jobId).toBe(jobId)
    expect(jobStatus.status).toBe('pending')
    expect(jobStatus.createdAt).toEqual(createdAt)
    expect(jobStatus.updatedAt).toEqual(updatedAt)
    expect(jobStatus.error).toBeUndefined()
  })

  it('エラー付きで初期化される', () => {
    const jobId = '550e8400-e29b-41d4-a716-446655440000'
    const status = 'failed'
    const createdAt = new Date()
    const updatedAt = new Date()
    const error = 'Processing failed'

    const jobStatus = new JobStatus(jobId, status, createdAt, updatedAt, error)

    expect(jobStatus.status).toBe('failed')
    expect(jobStatus.error).toBe('Processing failed')
  })

  it('全てのステータスタイプを扱える', () => {
    const jobId = '550e8400-e29b-41d4-a716-446655440000'
    const now = new Date()

    const statuses: Array<'pending' | 'processing' | 'completed' | 'failed'> = [
      'pending',
      'processing',
      'completed',
      'failed',
    ]

    statuses.forEach((status) => {
      const jobStatus = new JobStatus(jobId, status, now, now)
      expect(jobStatus.status).toBe(status)
    })
  })

  it('createdAtとupdatedAtが異なる時刻を持てる', () => {
    const jobId = '550e8400-e29b-41d4-a716-446655440000'
    const createdAt = new Date('2025-12-08T00:00:00.000Z')
    const updatedAt = new Date('2025-12-08T00:05:00.000Z')

    const jobStatus = new JobStatus(jobId, 'completed', createdAt, updatedAt)

    expect(jobStatus.updatedAt.getTime()).toBeGreaterThan(jobStatus.createdAt.getTime())
  })
})
