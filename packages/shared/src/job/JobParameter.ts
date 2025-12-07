/**
 * ジョブのパラメータ
 */
export class JobParameter {
  constructor(
    public readonly fileData: Uint8Array,
    public readonly fileName: string
  ) {}
}
