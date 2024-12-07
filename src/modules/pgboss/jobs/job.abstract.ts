export interface BaseJobData {
  [key: string]: unknown
}

export abstract class BaseJobHandler<T extends BaseJobData = never> {
  abstract run (...data: T extends never ? [] : [T]): Promise<void> | void
  static uniqueBy? (data?: BaseJobData): string
}
