import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Typesense from 'typesense'

@Injectable()
export class TypesenseClient {
  private _client: Typesense.Client

  constructor (
    private readonly configService: ConfigService
  ) {
    this.initialize()
  }

  private initialize (): void {
    this._client = new Typesense.Client({
      nodes: [{
        host: this.configService.getOrThrow('TYPESENSE_HOST'),
        port: 8108,
        protocol: 'http'
      }],
      apiKey: this.configService.getOrThrow('TYPESENSE_KEY')
    })
  }

  public get client (): Typesense.Client {
    if (this._client == null) {
      throw new Error('Typesense is not initialized')
    }

    return this._client
  }
}
