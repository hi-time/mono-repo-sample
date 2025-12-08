/**
 * JobResultのテスト
 */

import { describe, it, expect } from 'vitest'
import { JobResult } from '../JobResult'

describe('JobResult', () => {
  it('正しいプロパティで初期化される', () => {
    const result = new JobResult(
      'test.pdf',
      'pdf',
      false,
      0.99,
      '99%',
      'PDF document',
      'document',
      'application/pdf',
      'pdf'
    )

    expect(result.fileName).toBe('test.pdf')
    expect(result.fileType).toBe('pdf')
    expect(result.isText).toBe(false)
    expect(result.score).toBe(0.99)
    expect(result.scorePercent).toBe('99%')
    expect(result.description).toBe('PDF document')
    expect(result.group).toBe('document')
    expect(result.mimeType).toBe('application/pdf')
    expect(result.extension).toBe('pdf')
  })

  it('テキストファイルとして初期化される', () => {
    const result = new JobResult(
      'test.txt',
      'txt',
      true,
      1.0,
      '100%',
      'Plain text',
      'text',
      'text/plain',
      'txt'
    )

    expect(result.isText).toBe(true)
    expect(result.fileType).toBe('txt')
    expect(result.group).toBe('text')
  })

  it('画像ファイルとして初期化される', () => {
    const result = new JobResult(
      'test.png',
      'png',
      false,
      0.98,
      '98%',
      'PNG image',
      'image',
      'image/png',
      'png'
    )

    expect(result.fileType).toBe('png')
    expect(result.group).toBe('image')
    expect(result.mimeType).toBe('image/png')
  })

  it('信頼度スコアが0〜1の範囲内', () => {
    const result = new JobResult(
      'test.pdf',
      'pdf',
      false,
      0.75,
      '75%',
      'PDF document',
      'document',
      'application/pdf',
      'pdf'
    )

    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(1)
  })
})
