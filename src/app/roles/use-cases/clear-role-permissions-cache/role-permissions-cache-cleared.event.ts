import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { DomainEvent } from '../../../../modules/domain-events/domain-event.js'

@OneOfMeta(DomainEventLog, DomainEventType.ROLE_PERMISSIONS_CACHE_CLEARED)
export class RolePermissionsCacheClearedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly roleUuids: string[]

  constructor (roleUuids: string[]) {
    this.roleUuids = roleUuids
  }
}

@RegisterDomainEvent(DomainEventType.ROLE_PERMISSIONS_CACHE_CLEARED, 1)
export class RolePermissionsCacheClearedEvent
  extends DomainEvent<RolePermissionsCacheClearedEventContent> {
  constructor (roleUuids: string[]) {
    super({
      content: new RolePermissionsCacheClearedEventContent(roleUuids)
    })
  }
}
