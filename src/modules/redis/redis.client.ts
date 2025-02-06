import assert from 'assert'
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

  onModuleInit (): void {
    this.client = createClient({
      url: this.configService.getOrThrow('REDIS_URL'),
      pingInterval: 10_000,
      disableOfflineQueue: true
    })

    this.client.on('error', (error) => {
      captureException(error)
    })

    void this.client.connect()
  }

  async onModuleDestroy (): Promise<void> {
    if (this.client !== undefined) {
      await this.client.quit()
    }
  }

  async getCachedValue (key: string): Promise<string | null> {
    return await this.performAndCatch(() => this.client.get(`${this.prefix}.${key}`))
  }

  async getCachedValues (keys: string[]): Promise<Array<string | null>> {
    const results = await this.performAndCatch(() => {
      const transformedKeys = keys.map(key => `${this.prefix}.${key}`)

      return this.client.mGet(transformedKeys)
    })

    return results ?? new Array<string | null>(keys.length).fill(null)
  }

  async putCachedValue (key: string, value: string, ttl = 7_200): Promise<void> {
    await this.perform(() => this.client.set(`${this.prefix}.${key}`, value, { EX: ttl }))
  }

  async putCachedValues (keys: string[], values: string[], ttl = 7_200): Promise<void> {
    assert(keys.length === values.length)

    await this.perform(() => {
      const transformedKeys = keys.map(key => `${this.prefix}.${key}`)
      const args = transformedKeys.flatMap((key, index) => [key, values[index]])

      const pipeline = this.client.multi()

      pipeline.mSet(args)
      transformedKeys.forEach(key => pipeline.expire(key, ttl))

      return pipeline.exec()
    })
  }

  async deleteCachedValue (key: string): Promise<void> {
    await this.perform(() => this.client.del(`${this.prefix}.${key}`))
  }

  async deleteCachedValues (keys: string[]): Promise<void> {
    await this.perform(() => {
      const transformedKeys = keys.map(key => `${this.prefix}.${key}`)

      return this.client.del(transformedKeys)
    })
  }

  private async perform<T>(action: () => Promise<T>): Promise<T | null> {
    if (!this.client.isReady) {
      return null
    }

    return await action()
  }

  private async performAndCatch<T>(action: () => Promise<T>): Promise<T | null> {
    if (!this.client.isReady) {
      return null
    }

    try {
      return await action()
    } catch (error) {
      captureException(error)

      return null
    }
  }
}
