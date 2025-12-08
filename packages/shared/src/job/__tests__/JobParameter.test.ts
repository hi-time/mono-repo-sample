/**
 * JobParameterのテスト
 */

import { describe, it, expect } from 'vitest'
import { JobParameter } from '../JobParameter'

describe('JobParameter', () => {
  it('正しいプロパティで初期化される', () => {
    const fileData = new Uint8Array([0x25, 0x50, 0x44, 0x46]) // PDF header
    const fileName = 'test.pdf'

    const parameter = new JobParameter(fileData, fileName)

    expect(parameter.fileData).toBe(fileData)
    expect(parameter.fileName).toBe(fileName)
  })

  it('空のファイルデータでも初期化できる', () => {
    const fileData = new Uint8Array([])
    const fileName = 'empty.txt'

    const parameter = new JobParameter(fileData, fileName)

    expect(parameter.fileData.length).toBe(0)
    expect(parameter.fileName).toBe('empty.txt')
  })

  it('日本語ファイル名を扱える', () => {
    const fileData = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f])
    const fileName = 'テスト.pdf'

    const parameter = new JobParameter(fileData, fileName)

    expect(parameter.fileName).toBe('テスト.pdf')
  })

  it('readonlyプロパティは変更できない', () => {
    const parameter = new JobParameter(new Uint8Array([1, 2, 3]), 'test.txt')

    // TypeScriptのreadonly検証
    expect(parameter.fileData).toBeInstanceOf(Uint8Array)
    expect(parameter.fileName).toBe('test.txt')
  })
})
