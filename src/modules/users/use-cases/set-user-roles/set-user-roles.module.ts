import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { CacheModule } from '../../../cache/cache.module.js'
import { TypesenseModule } from '../../../typesense/modules/typesense.module.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'
import { SetUserRolesUseCase } from './set-user-roles.use-case.js'
import { SetUserRolesController } from './set-user-roles.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole
    ]),
    CacheModule,
    TypesenseModule
  ],
  controllers: [SetUserRolesController],
  providers: [SetUserRolesUseCase]
})
export class SetUserRolesModule {}
