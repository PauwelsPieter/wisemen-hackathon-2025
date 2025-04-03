import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { type NatsConnection, connect, type KV, credsAuthenticator, type Authenticator, type Payload, type Subscription, type SubscriptionOptions } from 'nats'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@sentry/nestjs'
import { NatsUnavailableError } from './nats-unavailable.error.js'

interface SubscribeOptions {
  loadBalance: boolean
}

@Injectable()
export class NatsClient implements OnModuleInit, OnModuleDestroy {
  private _client?: NatsConnection
  private _cache?: KV
  private readonly queueName: string

  constructor (
    private readonly configService: ConfigService
  ) {
    this.queueName = 'nest-template-' + this.configService.get<string>('NODE_ENV', 'local')
  }

  public get client (): NatsConnection {
    if (this._client == null) {
      throw new NatsUnavailableError('The NATS client is not configured')
    } else {
      return this._client
    }
  }

  public get cache (): KV {
    if (this._cache == null) {
      throw new NatsUnavailableError('The NATS cache is not configured')
    } else {
      return this._cache
    }
  }

  async onModuleInit (): Promise<void> {
    try {
      const host = this.configService.getOrThrow<string>('NATS_HOST')
      const port = this.configService.getOrThrow<string>('NATS_PORT')

      this._client = await connect({
        servers: `nats://${host}:${port}`,
        authenticator: this.getAuthenticator(),
        timeout: 3000
      })

      this._cache = await this.client.jetstream().views.kv('cache')
    } catch (error) {
      captureException(error)
    }
  }

  async onModuleDestroy (): Promise<void> {
    if (this._client !== undefined) {
      await this._client.drain()
    }
  }

  private getAuthenticator (): Authenticator | undefined {
    const nkey = this.configService.get<string>('NATS_NKEY')

    if (nkey == null) {
      return undefined
    } else {
      return credsAuthenticator(new TextEncoder().encode(
        Buffer.from(nkey, 'base64').toString()
      ))
    }
  }

  subscribe (subject: string, options?: SubscribeOptions): Subscription {
    const opts: SubscriptionOptions = {}

    if (options?.loadBalance != null) {
      opts.queue = this.queueName
    }

    return this.client.subscribe(subject, opts)
  }

  publish (subject: string, message: Payload | undefined): void {
    this.client.publish(subject, message)
  }

  async getCachedValue (key: string): Promise<string | null> {
    const result = await this.cache.get(key)

    if (result != null && result.operation === 'PUT') {
      String(result.value)
    }

    return null
  }

  async putCachedValue (key: string, value: string): Promise<void> {
    await this.cache.put(key, value)
  }

  async deleteCachedValue (key: string): Promise<void> {
    await this.cache.delete(key)
  }
}
