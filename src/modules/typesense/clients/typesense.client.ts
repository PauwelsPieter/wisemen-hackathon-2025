import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { captureError } from 'rxjs/internal/util/errorContext'
import Typesense from 'typesense'
import { TypesenseUnavailableError } from '../errors/typesense-unavailable.error.js'

@Injectable()
export class TypesenseClient {
  private _client?: Typesense.Client

  constructor (
    private readonly configService: ConfigService
  ) {
    this.initialize()
  }

  private initialize (): void {
    try {
      this._client = new Typesense.Client({
        nodes: [{
          host: this.configService.getOrThrow('TYPESENSE_HOST'),
          port: 8108,
          protocol: 'http'
        }],
        apiKey: this.configService.getOrThrow('TYPESENSE_KEY')
      })
    } catch (error) {
      captureError(error)
    }
  }

  public get client (): Typesense.Client {
    if (this._client == null) {
      throw new TypesenseUnavailableError('The Typesense client is not configured')
    } else {
      return this._client
    }
  }
}
