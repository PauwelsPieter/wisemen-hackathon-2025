import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { TypesenseModule } from '../../../../modules/typesense/modules/typesense.module.js'
import { RoleCacheModule } from '../../cache/role-cache.module.js'
import { UpdateRolesBulkController } from './update-roles-bulk.controller.js'
import { UpdateRolesBulkUseCase } from './update-roles-bulk.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    TypesenseModule,
    RoleCacheModule
  ],
  controllers: [
    UpdateRolesBulkController
  ],
  providers: [
    UpdateRolesBulkUseCase
  ]
})
export class UpdateRolesBulkModule {}
