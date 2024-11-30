import {
  type CanActivate,
  type ExecutionContext,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../permission/permission.decorator.js'
import { AuthStorage } from '../auth.storage.js'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly authStorage: AuthStorage
  ) {}

  canActivate (context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    this.authStorage.getAuthOrFail()

    return true
  }
}
