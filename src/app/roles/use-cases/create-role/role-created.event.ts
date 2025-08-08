import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { RoleEvent } from '../../events/role.event.js'
import { Role } from '../../entities/role.entity.js'

@OneOfMeta(DomainEventLog, DomainEventType.ROLE_CREATED)
export class RoleCreatedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly roleUuid: string

  @ApiProperty({ type: 'string' })
  readonly roleName: string

  constructor (role: Role) {
    this.roleUuid = role.uuid
    this.roleName = role.name
  }
}

@RegisterDomainEvent(DomainEventType.ROLE_CREATED, 1)
export class RoleCreatedEvent extends RoleEvent<RoleCreatedEventContent> {
  constructor (role: Role) {
    super({
      roleUuid: role.uuid,
      content: new RoleCreatedEventContent(role)
    })
  }
}
