import { assert } from 'node:console'
import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@sentry/nestjs'
import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
  public client: RedisClientType
  private readonly prefix: string

  constructor (
    private readonly configService: ConfigService
  ) {
    this.prefix = this.configService.getOrThrow('NODE_ENV')
  }

  async onModuleInit (): Promise<void> {
    this.client = createClient({
      url: this.configService.getOrThrow('REDIS_URL'),
      pingInterval: 10_000,
      disableOfflineQueue: true
    })

    this.client.on('error', (error) => {
      captureException(error)
    })

    await this.client.connect()
  }

  async onModuleDestroy (): Promise<void> {
    if (this.client !== undefined) {
      await this.client.quit()
    }
  }

  async getCachedValue (key: string): Promise<string | null> {
    return await this.client.get(`${this.prefix}.${key}`)
  }

  async getCachedValues (keys: string[]): Promise<(string | null)[]> {
    const transformedKeys = keys.map(key => `${this.prefix}.${key}`)

    return await this.client.mGet(transformedKeys)
  }

  async putCachedValue (key: string, value: string, ttl = 7200): Promise<void> {
    await this.client.set(`${this.prefix}.${key}`, value, { EX: ttl })
  }

  async putCachedValues (keys: string[], values: string[]): Promise<void> {
    assert(keys.length === values.length)

    const transformedKeys = keys.map(key => `${this.prefix}.${key}`)
    const args = transformedKeys.flatMap((key, index) => [key, values[index]])

    await this.client.mSet(args)
  }

  async deleteCachedValue (key: string): Promise<void> {
    await this.client.del(`${this.prefix}.${key}`)
  }

  async deleteCachedValues (keys: string[]): Promise<void> {
    const transformedKeys = keys.map(key => `${this.prefix}.${key}`)

    await this.client.del(transformedKeys)
  }
}
