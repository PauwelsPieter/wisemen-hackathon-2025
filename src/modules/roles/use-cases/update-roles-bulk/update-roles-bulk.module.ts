import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { TypesenseModule } from '../../../typesense/modules/typesense.module.js'
import { CacheModule } from '../../../cache/cache.module.js'
import { UpdateRolesBulkController } from './update-roles-bulk.controller.js'
import { UpdateRolesBulkUseCase } from './update-roles-bulk.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    TypesenseModule,
    CacheModule
  ],
  controllers: [UpdateRolesBulkController],
  providers: [UpdateRolesBulkUseCase]
})
export class UpdateRolesBulkModule {}
