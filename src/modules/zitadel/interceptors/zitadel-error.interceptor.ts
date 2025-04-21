import { Code, ConnectError, Interceptor } from '@connectrpc/connect'
import { ZitadelUnknownError } from '../errors/zitadel-unknown-error.js'
import { ZitadelBadRequestError, ZitadelConflictError, ZitadelGatewayTimeoutError, ZitadelInternalError, ZitadelNotFoundError, ZitadelNotImplementedError, ZitadelUnauthorizedError } from '../errors/zitadel.error.js'

export function createZitadelErrorInterceptor (): Interceptor {
  return next => async (req) => {
    try {
      return await next(req)
    } catch (error) {
      if (error instanceof ConnectError) {
        throw mapErrorCodeToError(error)
      } else {
        throw new ZitadelUnknownError(error)
      }
    }
  }
}

function mapErrorCodeToError (error: ConnectError): Error {
  switch (error.code) {
    case Code.InvalidArgument:
    case Code.FailedPrecondition:
      return new ZitadelBadRequestError(error)
    case Code.AlreadyExists:
      return new ZitadelConflictError(error)
    case Code.NotFound:
      return new ZitadelNotFoundError(error)
    case Code.Unauthenticated:
      return new ZitadelUnauthorizedError(error)
    case Code.Internal:
      return new ZitadelInternalError(error)
    case Code.Unimplemented:
      return new ZitadelNotImplementedError(error)
    case Code.DeadlineExceeded:
      return new ZitadelGatewayTimeoutError(error)
    default:
      return new ZitadelUnknownError(error)
  }
}
