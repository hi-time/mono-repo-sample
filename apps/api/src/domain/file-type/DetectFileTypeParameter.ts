/**
 * ファイルタイプ判定のパラメータ
 */
export class DetectFileTypeParameter {
  constructor(
    public readonly fileData: Uint8Array,
    public readonly fileName: string
  ) {}
}
