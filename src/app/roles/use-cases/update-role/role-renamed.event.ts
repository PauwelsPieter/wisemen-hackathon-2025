import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta } from '@wisemen/one-of'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { RoleEvent } from '../../events/role.event.js'
import { Role } from '../../entities/role.entity.js'

@OneOfMeta(DomainEventLog, DomainEventType.ROLE_RENAMED)
export class RoleRenamedEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly roleUuid: string

  @ApiProperty({ type: 'string' })
  readonly previousName: string

  @ApiProperty({ type: 'string' })
  readonly newName: string

  constructor (role: Role, previousName: string) {
    this.roleUuid = role.uuid
    this.newName = role.name
    this.previousName = previousName
  }
}

@RegisterDomainEvent(DomainEventType.ROLE_RENAMED, 1)
export class RoleRenamedEvent extends RoleEvent<RoleRenamedEventContent> {
  constructor (role: Role, previousName: string) {
    super({
      roleUuid: role.uuid,
      content: new RoleRenamedEventContent(role, previousName)
    })
  }
}
