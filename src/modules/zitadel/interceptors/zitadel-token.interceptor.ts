import { Interceptor } from '@connectrpc/connect'

export function createZitadelTokenInterceptor (token: string): Interceptor {
  return next => async (req) => {
    req.header.set('Authorization', `Bearer ${token}`)
    return await next(req)
  }
}
