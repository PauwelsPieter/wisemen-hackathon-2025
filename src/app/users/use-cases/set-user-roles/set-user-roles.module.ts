import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { TypesenseModule } from '../../../../modules/typesense/modules/typesense.module.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'
import { UserCacheModule } from '../../cache/user-cache.module.js'
import { SetUserRolesUseCase } from './set-user-roles.use-case.js'
import { SetUserRolesController } from './set-user-roles.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole
    ]),
    TypesenseModule,
    UserCacheModule
  ],
  controllers: [SetUserRolesController],
  providers: [SetUserRolesUseCase]
})
export class SetUserRolesModule {}
