/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IncomingMessage } from 'http'
import { AsyncResource } from 'async_hooks'
import { Server } from 'http'
import { Injectable, UnauthorizedException, type INestApplicationContext } from '@nestjs/common'
import { WsAdapter } from '@nestjs/platform-ws'
import { WebSocketServer } from 'ws'
import { MessageMappingProperties } from '@nestjs/websockets'
import { filter, first, fromEvent, mergeMap, Observable, share, takeUntil } from 'rxjs'
import {
  CLOSE_EVENT
} from '@nestjs/websockets/constants.js'
import { WebSocket } from 'ws'
import { isNil } from '@nestjs/common/utils/shared.utils.js'
import { AuthMiddleware } from '../auth/middleware/auth.middleware.js'
import { AuthContent, AuthStorage } from '../auth/auth.storage.js'

declare module 'http' {
  interface IncomingMessage {
    userUuid: string
  }
}

enum READY_STATE {
  CONNECTING_STATE = 0,
  OPEN_STATE = 1,
  CLOSING_STATE = 2,
  CLOSED_STATE = 3
}

@Injectable()
export class AuthenticatedWsAdapter extends WsAdapter {
  private readonly authMiddleware: AuthMiddleware
  private readonly authStorage: AuthStorage

  constructor (appOrHttpServer: INestApplicationContext) {
    super(appOrHttpServer)

    this.authMiddleware = appOrHttpServer.get(AuthMiddleware)
    this.authStorage = appOrHttpServer.get(AuthStorage)
  }

  public override create (
    port: number,
    options?: Record<string, any> & {
      namespace?: string
      server?: unknown
      path?: string
    }
  ): any {
    const { server, path, ...wsOptions } = options ?? {}

    if (server != null) {
      return server
    }

    this.ensureHttpServerExists(
      port,
      this.httpServer as Server
    )

    const wss = this.bindErrorHandler(new WebSocketServer({
      noServer: true,
      ...wsOptions
    })) as WebSocketServer

    this.addWsServerToRegistry(wss, port, path ?? '/')

    wss.options.verifyClient = (
      info: { req: IncomingMessage },
      cb: (res: boolean, code?: number, message?: string, headers?: Record<string, string>) => void
    ): void => {
      const authHeaderParam = info.req.headers.authorization
      const authQueryParam = new URLSearchParams(info.req.url?.split('?')[1]).get('authorization')
      const authToken = authHeaderParam ?? authQueryParam

      if (authToken == null) {
        cb(false)
      } else {
        this.verifyAuthorization(authToken)
          .then((auth) => {
            this.authStorage.run(auth, () => {
              cb(true)
            })
          })
          .catch(() => {
            cb(false)
          })
      }
    }

    return wss
  }

  public override bindMessageHandlers (
    client: WebSocket,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>
  ) {
    const asyncResource = new AsyncResource('WebSocket')
    const handlersMap = new Map<string, MessageMappingProperties>()

    handlers.forEach(handler => handlersMap.set(handler.message as string, handler))

    const close$ = fromEvent(client, CLOSE_EVENT).pipe(share(), first())
    const source$ = fromEvent(client, 'message').pipe(
      mergeMap<{ data: string }, Observable<any>>(data =>
        // this.bindMessageHandler(data, handlersMap, transform).pipe(
        //   filter(result => !isNil(result))
        // )
        // eslint-disable-next-line @typescript-eslint/unbound-method
        asyncResource.runInAsyncScope(this.bindMessageHandler, this, data, handlersMap, transform)
          .pipe(filter(result => !isNil(result)))

      ),
      takeUntil(close$)
    )
    const onMessage = (response: any) => {
      if (client.readyState !== READY_STATE.OPEN_STATE) {
        return
      }

      client.send(JSON.stringify(response))
    }

    source$.subscribe(onMessage)
  }

  private async verifyAuthorization (header: string): Promise<AuthContent> {
    const [bearer, token] = header.split(' ')

    if (bearer !== 'Bearer' || token == null) {
      throw new UnauthorizedException()
    }

    const payload = await this.authMiddleware.verify(token)

    return {
      uuid: payload.uuid,
      userId: payload.userId
    }
  }
}
