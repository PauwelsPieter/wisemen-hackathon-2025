import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypesenseModule } from '../typesense/modules/typesense.module.js'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { CacheModule } from '../cache/cache.module.js'
import { RoleModule } from '../roles/role.module.js'
import { RedisModule } from '../redis/redis.module.js'
import { User } from './entities/user.entity.js'
import { UserRepository } from './repositories/user.repository.js'
import { UserTypesenseRepository } from './repositories/user-typesense.repository.js'
import { ViewUserController } from './use-cases/view-user/view-user.controller.js'
import { ViewUsersController } from './use-cases/view-users/view-users.controller.js'
import { ViewUsersUseCase } from './use-cases/view-users/view-users.use-case.js'
import { ViewUserUseCase } from './use-cases/view-user/view-user.use-case.js'
import {
  ChangeUserRoleController
} from './use-cases/change-user-role/change-user-role.controller.js'
import { ChangeUserRoleUseCase } from './use-cases/change-user-role/change-user-role.use-case.js'
import { UserAuthService } from './services/user-auth.service.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule,
    TypesenseModule,
    RoleModule,
    RedisModule.forRoot()
  ],
  controllers: [
    ChangeUserRoleController,
    ViewUserController,
    ViewUsersController
  ],
  providers: [
    UserAuthService,
    UserRepository,
    UserTypesenseRepository,
    RoleRepository,
    ChangeUserRoleUseCase,
    ViewUserUseCase,
    ViewUsersUseCase
  ],
  exports: [UserAuthService]
})
export class UserModule {}
