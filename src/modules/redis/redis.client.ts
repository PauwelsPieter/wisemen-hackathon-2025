import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
      pingInterval: 10000
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

  async putCachedValue (key: string, value: string, ttl = 7200): Promise<void> {
    await this.client.set(`${this.prefix}.${key}`, value, { EX: ttl })
  }

  async deleteCachedValue (key: string): Promise<void> {
    await this.client.del(`${this.prefix}.${key}`)
  }
}
