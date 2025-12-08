/**
 * ドメインモデルのテスト - FileTypeResult
 */

import { describe, it, expect } from 'vitest'
import { FileTypeResult } from '../FileTypeResult'

describe('FileTypeResult', () => {
  it('正しいプロパティで初期化される', () => {
    const result = new FileTypeResult(
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
    const result = new FileTypeResult(
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
    expect(result.score).toBe(1.0)
  })
})

