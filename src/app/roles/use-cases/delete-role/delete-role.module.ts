import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Role } from '../../entities/role.entity.js'
import { UserRole } from '../../entities/user-role.entity.js'
import { DeleteRoleController } from './delete-role.controller.js'
import { DeleteRoleUseCase } from './delete-role.use-case.js'
import { DeleteRoleRepository } from './delete-role.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, UserRole])
  ],
  controllers: [DeleteRoleController],
  providers: [DeleteRoleUseCase, DeleteRoleRepository]
})
export class DeleteRoleModule {}
