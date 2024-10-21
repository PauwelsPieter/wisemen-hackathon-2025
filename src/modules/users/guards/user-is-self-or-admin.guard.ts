import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { Permission } from '../../permissions/permission.enum.js'
import { CacheService } from '../../cache/cache.service.js'
import { AuthStorage } from '../../auth/auth.storage.js'

@Injectable()
export class UserIsSelfOrAdminGuard implements CanActivate {
  constructor (
    private readonly cache: CacheService,
    private readonly authStorage: AuthStorage
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const userUuid = this.authStorage.getUserUuid()
    const { params } = context.switchToHttp().getRequest<Request>()

    if (userUuid === params.user) {
      return true
    } else {
      const userPermissions = await this.cache.getUserPermissions(userUuid)

      return userPermissions.includes(Permission.ADMIN)
    }
  }
}
