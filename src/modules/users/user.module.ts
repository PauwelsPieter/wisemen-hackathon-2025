import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { RedisModule } from '../redis/redis.module.js'
import { TypesenseModule } from '../typesense/modules/typesense.module.js'
import { Role } from '../roles/entities/role.entity.js'
import { UserRole } from '../roles/entities/user-role.entity.js'
import { UserAuthService } from './services/user-auth.service.js'
import { SetUserRolesModule } from './use-cases/set-user-roles/set-user-roles.module.js'
import { ViewMeModule } from './use-cases/view-me/view-me.module.js'
import { ViewUserModule } from './use-cases/view-user/view-user.module.js'
import { ViewUsersModule } from './use-cases/view-users/view-users.module.js'
import { User } from './entities/user.entity.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Role, UserRole
    ]),
    RedisModule.forRoot(),
    TypesenseModule,
    SetUserRolesModule,
    ViewMeModule,
    ViewUserModule,
    ViewUsersModule
  ],
  providers: [
    UserAuthService
  ],
  exports: [UserAuthService]
})
export class UserModule {}
