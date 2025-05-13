import { Module } from '@nestjs/common'

import { RedisModule } from '../../modules/redis/redis.module.js'
import { TypesenseModule } from '../../modules/typesense/typesense.module.js'
import { UserAuthService } from './services/user-auth.service.js'
import { SetUserRolesModule } from './use-cases/set-user-roles/set-user-roles.module.js'
import { ViewMeModule } from './use-cases/view-me/view-me.module.js'
import { ViewUserDetailModule } from './use-cases/view-user-detail/view-user-detail.module.js'
import { ViewUserIndexModule } from './use-cases/view-user-index/view-user-index.module.js'
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
    ViewUserDetailModule,
    ViewUserIndexModule,
    GetOrCreateUserModule,
    AssignDefaultRoleToUserSubscriberModule
  ],
  providers: [UserAuthService],
  exports: [UserAuthService]
})
export class UserModule {}
