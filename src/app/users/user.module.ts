import { Module } from '@nestjs/common'

import { RedisModule } from '../../modules/redis/redis.module.js'
import { TypesenseModule } from '../../modules/typesense/modules/typesense.module.js'
import { UserAuthService } from './services/user-auth.service.js'
import { SetUserRolesModule } from './use-cases/set-user-roles/set-user-roles.module.js'
import { ViewMeModule } from './use-cases/view-me/view-me.module.js'
import { ViewUserModule } from './use-cases/view-user/view-user.module.js'
import { ViewUsersModule } from './use-cases/view-users/view-users.module.js'
import { GetOrCreateUserModule } from './use-cases/get-or-create-user/get-or-create-user.module.js'
import {
  AssignDefaultRoleToUserSubscriberModule
} from './use-cases/assign-default-role-to-user/assign-default-role-to-user-subscriber.module.js'

@Module({
  imports: [
    RedisModule,
    TypesenseModule,
    SetUserRolesModule,
    ViewMeModule,
    ViewUserModule,
    ViewUsersModule,
    GetOrCreateUserModule,
    AssignDefaultRoleToUserSubscriberModule
  ],
  providers: [UserAuthService],
  exports: [UserAuthService]
})
export class UserModule {}
