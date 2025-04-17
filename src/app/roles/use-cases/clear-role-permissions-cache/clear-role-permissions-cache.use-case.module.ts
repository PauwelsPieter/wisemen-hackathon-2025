import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { RoleCacheModule } from '../../cache/role-cache.module.js'
import { Role } from '../../entities/role.entity.js'
import { DomainEventEmitterModule } from '../../../../modules/domain-events/domain-event-emitter.module.js'
import { ClearRolePermissionsCacheUseCase } from './clear-role-permissions-cache.use-case.js'

@Module({
  imports: [
    RoleCacheModule,
    TypeOrmModule.forFeature([Role]),
    DomainEventEmitterModule
  ],
  providers: [ClearRolePermissionsCacheUseCase],
  exports: [ClearRolePermissionsCacheUseCase]
})
export class ClearRolePermissionsCacheUseCaseModule {}
