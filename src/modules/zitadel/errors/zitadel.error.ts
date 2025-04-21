import { ConnectError } from '@connectrpc/connect'

export class ZitadelError extends ConnectError {
  readonly internalError: ConnectError

  constructor (error: ConnectError) {
    super(error.message, error.code)
    this.internalError = error
  }
}

export class ZitadelBadRequestError extends ZitadelError { }
export class ZitadelConflictError extends ZitadelError { }
export class ZitadelNotFoundError extends ZitadelError { }
export class ZitadelUnauthorizedError extends ZitadelError { }
export class ZitadelNotImplementedError extends ZitadelError { }
export class ZitadelInternalError extends ZitadelError { }
export class ZitadelGatewayTimeoutError extends ZitadelError { }
