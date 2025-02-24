import { Module } from '@nestjs/common'
import { CreateRoleModule } from './use-cases/create-role/create-role.module.js'
import { DeleteRoleModule } from './use-cases/delete-role/delete-role.module.js'
import { UpdateRoleModule } from './use-cases/update-role/update-role.module.js'
import { UpdateRolesBulkModule } from './use-cases/update-roles-bulk/update-roles-bulk.module.js'
import { ViewRoleModule } from './use-cases/view-role/view-role.module.js'
import { ViewRolesModule } from './use-cases/view-roles/view-roles.module.js'

@Module({
  imports: [
    CreateRoleModule,
    DeleteRoleModule,
    UpdateRolesBulkModule,
    UpdateRoleModule,
    ViewRoleModule,
    ViewRolesModule
  ]
})
export class RoleModule {}
