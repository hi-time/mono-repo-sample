/**
 * ファイルタイプ判定の結果データ
 */
export class FileTypeResult {
  constructor(
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly isText: boolean,
    public readonly score: number,
    public readonly scorePercent: string,
    public readonly description: string,
    public readonly group: string,
    public readonly mimeType: string,
    public readonly extension: string
  ) {}
}
