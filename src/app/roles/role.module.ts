import { Module } from '@nestjs/common'
import { CreateRoleModule } from './use-cases/create-role/create-role.module.js'
import { DeleteRoleModule } from './use-cases/delete-role/delete-role.module.js'
import { UpdateRoleModule } from './use-cases/update-role/update-role.module.js'
import { ViewRoleModule } from './use-cases/view-role/view-role.module.js'
import { ViewRolesModule } from './use-cases/view-roles/view-roles.module.js'
import { UpdateRolesPermissionsModule } from './use-cases/update-roles-permissions/update-roles-permissions.module.js'
import { ClearRolePermissionsCacheModule } from './use-cases/clear-role-permissions-cache/clear-role-permissions-cache.module.js'

@Module({
  imports: [
    CreateRoleModule,
    DeleteRoleModule,
    UpdateRoleModule,
    ViewRoleModule,
    ViewRolesModule,
    UpdateRolesPermissionsModule,
    ClearRolePermissionsCacheModule
  ]
})
export class RoleModule {}
