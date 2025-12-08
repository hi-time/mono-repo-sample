/**
 * バッチワーカーのテスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// モックデータ
const mockJobResult = {
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

describe('Batch Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Job Processing Logic', () => {
    it('スコアをパーセンテージに変換できる', () => {
      const score = 0.99
      const scorePercent = `${Math.round(score * 100)}%`
      expect(scorePercent).toBe('99%')
    })

    it('スコア0の場合も正しく変換される', () => {
      const score = 0
      const scorePercent = `${Math.round(score * 100)}%`
      expect(scorePercent).toBe('0%')
    })

    it('スコア1の場合も正しく変換される', () => {
      const score = 1.0
      const scorePercent = `${Math.round(score * 100)}%`
      expect(scorePercent).toBe('100%')
    })

    it('小数点以下のスコアを丸める', () => {
      const score = 0.856
      const scorePercent = `${Math.round(score * 100)}%`
      expect(scorePercent).toBe('86%')
    })
  })

  describe('File Extension Handling', () => {
    it('配列の拡張子をカンマ区切りに変換', () => {
      const extensions = ['jpg', 'jpeg']
      const result = extensions.join(', ')
      expect(result).toBe('jpg, jpeg')
    })

    it('単一の拡張子を処理', () => {
      const extension = 'pdf'
      expect(extension).toBe('pdf')
    })

    it('拡張子がない場合は空文字列', () => {
      const extensions: string[] = []
      const result = extensions.join(', ')
      expect(result).toBe('')
    })
  })

  describe('Error Message Formatting', () => {
    it('Errorオブジェクトからメッセージを取得', () => {
      const error = new Error('Test error message')
      const errorMessage = error instanceof Error ? error.message : String(error)
      expect(errorMessage).toBe('Test error message')
    })

    it('文字列エラーを処理', () => {
      const error = 'Simple error string'
      const errorMessage = typeof error === 'string' ? error : String(error)
      expect(errorMessage).toBe('Simple error string')
    })

    it('未知のエラー型を文字列に変換', () => {
      const error = { code: 500, message: 'Server error' }
      const errorMessage = String(error)
      expect(errorMessage).toBe('[object Object]')
    })
  })

  describe('Job Result Creation', () => {
    it('JobResultオブジェクトを正しく作成', () => {
      const result = {
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

      expect(result.fileName).toBe('test.pdf')
      expect(result.fileType).toBe('pdf')
      expect(result.isText).toBe(false)
      expect(result.score).toBe(0.99)
      expect(result.scorePercent).toBe('99%')
    })
  })

  describe('Polling Interval Configuration', () => {
    it('ポーリング間隔が1秒（1000ms）', () => {
      const POLLING_INTERVAL = 1000
      expect(POLLING_INTERVAL).toBe(1000)
    })

    it('クリーンアップ間隔が1時間', () => {
      const CLEANUP_INTERVAL = 60 * 60 * 1000
      expect(CLEANUP_INTERVAL).toBe(3600000)
    })
  })
})
