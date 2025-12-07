/**
 * ジョブのステータス
 */
export type JobStatusType = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * ジョブのステータス情報
 */
export class JobStatus {
  constructor(
    public readonly jobId: string,
    public readonly status: JobStatusType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly error?: string
  ) {}
}
