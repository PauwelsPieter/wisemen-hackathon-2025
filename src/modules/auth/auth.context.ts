import { AsyncLocalStorage } from 'async_hooks'
import { Injectable } from '@nestjs/common'
import { UnauthorizedError } from '../exceptions/generic/unauthorized.error.js'
import { UserUuid } from '../../app/users/entities/user.uuid.js'

export interface AuthContent {
  userId: string
  uuid: UserUuid
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

  public getUserUuidOrFail (): UserUuid {
    return this.getAuthOrFail().uuid
  }

  public getUserUuid (): UserUuid | null {
    return this.getAuth()?.uuid ?? null
  }

  public run (content: AuthContent, callback: () => void): void {
    this.authStorage.run(content, callback)
  }
}
