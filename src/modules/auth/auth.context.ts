import { AsyncLocalStorage } from 'async_hooks'
import { Injectable } from '@nestjs/common'
import { UnauthorizedError } from '../exceptions/generic/unauthorized.error.js'

export interface AuthContent {
  userId: string
  uuid: string
}

@Injectable()
export class AuthContext {
  private readonly authStorage = new AsyncLocalStorage<AuthContent>()

  public getAuthOrFail (): AuthContent {
    const token = this.authStorage.getStore()

    if (token == null) {
      throw new UnauthorizedError()
    }

    return token
  }

  public getAuth (): AuthContent | undefined {
    return this.authStorage.getStore()
  }

  public getUserUuidOrFail (): string {
    return this.getAuthOrFail().uuid
  }

  public getUserUuid (): string | null {
    return this.getAuth()?.uuid ?? null
  }

  public run (content: AuthContent, callback: () => void): void {
    this.authStorage.run(content, callback)
  }
}
