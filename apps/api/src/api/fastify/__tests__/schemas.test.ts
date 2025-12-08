/**
 * Zodスキーマのテスト
 */

import { describe, it, expect } from 'vitest'
import {
  HealthResponseSchema,
  FileTypeResponseSchema,
  JobCreateResponseSchema,
  JobStatusResponseSchema,
  JobResultResponseSchema,
} from '../schemas'

describe('API Schemas', () => {
  describe('HealthResponseSchema', () => {
    it('正しいヘルスチェックレスポンスをパースする', () => {
      const data = {
        status: 'ok',
        timestamp: '2025-12-08T00:00:00.000Z',
        service: 'backend',
      }

      const result = HealthResponseSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('ok')
      }
    })

    it('不正なステータスを拒否する', () => {
      const data = {
        status: 'error',
        timestamp: '2025-12-08T00:00:00.000Z',
        service: 'backend',
      }

      const result = HealthResponseSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('FileTypeResponseSchema', () => {
    it('正しいファイルタイプレスポンスをパースする', () => {
      const data = {
        fileName: 'test.pdf',
        fileType: 'pdf',
        isText: false,
        score: 0.99,
        scorePercent: '99%',
        description: 'PDF document',
        group: 'document',
        mimeType: 'application/pdf',
        extension: 'pdf',
      }

      const result = FileTypeResponseSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.fileType).toBe('pdf')
        expect(result.data.score).toBe(0.99)
      }
    })

    it('必須フィールドが欠けている場合拒否する', () => {
      const data = {
        fileName: 'test.pdf',
        fileType: 'pdf',
      }

      const result = FileTypeResponseSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('JobCreateResponseSchema', () => {
    it('正しいジョブ作成レスポンスをパースする', () => {
      const data = {
        jobId: '550e8400-e29b-41d4-a716-446655440000',
        message: 'ジョブを投入しました',
      }

      const result = JobCreateResponseSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('JobStatusResponseSchema', () => {
    it('正しいジョブステータスレスポンスをパースする', () => {
      const data = {
        jobId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'completed',
        createdAt: '2025-12-08T00:00:00.000Z',
        updatedAt: '2025-12-08T00:00:05.000Z',
      }

      const result = JobStatusResponseSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('completed')
      }
    })

    it('不正なステータスを拒否する', () => {
      const data = {
        jobId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'invalid',
        createdAt: '2025-12-08T00:00:00.000Z',
        updatedAt: '2025-12-08T00:00:05.000Z',
      }

      const result = JobStatusResponseSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('オプショナルなerrorフィールドを許容する', () => {
      const data = {
        jobId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'failed',
        createdAt: '2025-12-08T00:00:00.000Z',
        updatedAt: '2025-12-08T00:00:05.000Z',
        error: 'Processing failed',
      }

      const result = JobStatusResponseSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.error).toBe('Processing failed')
      }
    })
  })

  describe('JobResultResponseSchema', () => {
    it('正しいジョブ結果レスポンスをパースする', () => {
      const data = {
        fileName: 'test.pdf',
        fileType: 'pdf',
        isText: false,
        score: 0.99,
        scorePercent: '99%',
        description: 'PDF document',
        group: 'document',
        mimeType: 'application/pdf',
        extension: 'pdf',
      }

      const result = JobResultResponseSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})
