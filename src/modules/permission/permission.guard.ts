import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthStorage } from '../auth/auth.storage.js'
import type { Permission } from './permission.enum.js'
import { PERMISSIONS_KEY } from './permission.decorator.js'
import { PermissionService } from './permission.service.js'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    private readonly authStorage: AuthStorage
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (requiredPermissions == null) {
      return true
    }

    const userUuid = this.authStorage.getUserUuid()

    return await this.permissionService.hasPermissions(userUuid, requiredPermissions)
  }
}
