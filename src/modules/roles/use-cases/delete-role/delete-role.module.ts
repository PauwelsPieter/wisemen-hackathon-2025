import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { CacheModule } from '../../../cache/cache.module.js'
import { DeleteRoleController } from './delete-role.controller.js'
import { DeleteRoleUseCase } from './delete-role.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, UserRole]),
    CacheModule
  ],
  controllers: [DeleteRoleController],
  providers: [DeleteRoleUseCase]
})
export class DeleteRoleModule {}
