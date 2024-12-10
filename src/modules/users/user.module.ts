import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { TypesenseModule } from '../typesense/modules/typesense.module.js'
import { CacheModule } from '../cache/cache.module.js'
import { RoleModule } from '../roles/role.module.js'
import { RedisModule } from '../redis/redis.module.js'
import { UserRole } from '../roles/entities/user-role.entity.js'
import { User } from './entities/user.entity.js'
import { UserRepository } from './repositories/user.repository.js'
import { UserTypesenseRepository } from './repositories/user-typesense.repository.js'
import { ViewUserController } from './use-cases/view-user/view-user.controller.js'
import { ViewUsersController } from './use-cases/view-users/view-users.controller.js'
import { ViewUsersUseCase } from './use-cases/view-users/view-users.use-case.js'
import { ViewUserUseCase } from './use-cases/view-user/view-user.use-case.js'
import {
  SetUserRolesController
} from './use-cases/set-user-roles/set-user-roles.controller.js'
import { SetUserRolesUseCase } from './use-cases/set-user-roles/set-user-roles.use-case.js'
import { UserAuthService } from './services/user-auth.service.js'
import { ViewMeController } from './use-cases/view-me/view-me.controller.js'
import { ViewMeUseCase } from './use-cases/view-me/view-me.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole]),
    CacheModule,
    TypesenseModule,
    RoleModule,
    RedisModule.forRoot()
  ],
  controllers: [
    SetUserRolesController,
    ViewMeController,
    ViewUserController,
    ViewUsersController
  ],
  providers: [
    UserAuthService,
    UserRepository,
    UserTypesenseRepository,
    SetUserRolesUseCase,
    ViewMeUseCase,
    ViewUserUseCase,
    ViewUsersUseCase
  ],
  exports: [UserAuthService]
})
export class UserModule {}
