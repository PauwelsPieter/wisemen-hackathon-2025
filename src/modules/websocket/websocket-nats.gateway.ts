import { randomUUID } from 'node:crypto'
import { WebSocketGateway, SubscribeMessage, type OnGatewayConnection, type OnGatewayDisconnect, WebSocketServer, WsException, BaseWsExceptionFilter } from '@nestjs/websockets'
import { WebSocket, WebSocketServer as WSS } from 'ws'
import type { Subscription } from 'nats'
import { type ArgumentsHost, Catch, UsePipes, ValidationPipe, UseFilters, UnauthorizedException } from '@nestjs/common'
import { captureException } from '@sentry/nestjs'
import { NatsClient } from '../nats/nats.client.js'
import { SubscribeCommand } from './commands/subscribe.command.js'
import { UnsubscribeCommand } from './commands/unsubscribe.command.js'
import { WebsocketTopicValidator } from './websocket-topic.validator.js'
import { PingPongCommand } from './commands/ping-pong.command.js'

declare module 'ws' {
  interface WebSocket {
    uuid: string
  }
}

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch (exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<WebSocket>()
    const data = host.switchToWs().getData<unknown>()

    const error = exception instanceof UnauthorizedException
      ? exception.message
      : exception.getError()

    client.send(JSON.stringify({
      error,
      data
    }))
  }
}
@WebSocketGateway(Number(process.env.PORT ?? 3000), {
  wsEngine: 'ws',
  transports: ['websocket'],
  path: '/websockets'
})
export class WebsocketNatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly clients = new Map<string, WebSocket>()
  private readonly subscriptions = new Map<string, Map<string, Subscription>>()

  constructor (
    private readonly natsClient: NatsClient,
    private readonly topicValidator: WebsocketTopicValidator
  ) {}

  @WebSocketServer()
  server: WSS

  handleConnection (client: WebSocket): void {
    client.uuid = randomUUID()
    this.clients.set(client.uuid, client)
    this.subscriptions.set(client.uuid, new Map<string, Subscription>())
  }

  handleDisconnect (client: WebSocket): void {
    const clientSubscriptions = this.subscriptions.get(client.uuid)

    clientSubscriptions?.forEach((clientSubscription) => {
      clientSubscription.unsubscribe()
    })

    this.subscriptions.delete(client.uuid)
    this.clients.delete(client.uuid)
  }

  @UsePipes(new ValidationPipe({
    exceptionFactory (errors) {
      throw new WsException(errors)
    }
  }))
  @UseFilters(new WsExceptionFilter())
  @SubscribeMessage('subscribe')
  async handleSubscribe (client: WebSocket, payload: SubscribeCommand): Promise<void> {
    const clientSubscriptions = this.subscriptions.get(client.uuid)

    if (clientSubscriptions == null || clientSubscriptions.has(payload.topic)) {
      return
    }

    this.topicValidator.validate(payload.topic)

    const subscription = this.natsClient.subscribe(payload.topic)

    clientSubscriptions.set(payload.topic, subscription)

    client.send(JSON.stringify({
      event: 'subscribed',
      data: {
        topic: payload.topic
      }
    }))

    for await (const msg of subscription) {
      try {
        const data = new TextDecoder().decode(msg.data)

        client.send(data)
      } catch (e) {
        captureException(e)
      }
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe (client: WebSocket, payload: UnsubscribeCommand): void {
    const clientSubscriptions = this.subscriptions.get(client.uuid)

    if (clientSubscriptions == null) {
      return
    }

    const subscription = clientSubscriptions.get(payload.topic)

    if (subscription != null) {
      subscription.unsubscribe()
      clientSubscriptions.delete(payload.topic)
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('ping')
  handlePing (client: WebSocket, payload: PingPongCommand): void {
    client.send(JSON.stringify({
      event: 'pong',
      data: {
        uuid: payload.uuid
      }
    }))
  }
}
