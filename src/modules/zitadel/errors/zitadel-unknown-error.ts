import { ConnectError } from '@connectrpc/connect'

export class ZitadelUnknownError extends ConnectError {
  readonly internalError: unknown

  constructor (error: unknown) {
    super(ZitadelUnknownError.getErrorMessage(error))
    this.internalError = error
  }

  private static getErrorMessage (error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }

    return 'Unknown zitadel error'
  }
}
