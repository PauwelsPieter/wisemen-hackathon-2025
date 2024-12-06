import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { Permission } from '../../permission/permission.enum.js'
import { CacheService } from '../../cache/cache.service.js'
import { AuthStorage } from '../../auth/auth.storage.js'

@Injectable()
export class UserIsSelfOrAdminGuard implements CanActivate {
  constructor (
    private readonly cache: CacheService,
    private readonly authStorage: AuthStorage
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const auth = this.authStorage.getAuthOrFail()
    const { params } = context.switchToHttp().getRequest<Request>()

    if (auth.userId === params.user) {
      return true
    } else {
      const userPermissions = await this.cache.getUserPermissions(auth.uuid)

      return userPermissions.includes(Permission.ADMIN)
    }
  }
}
