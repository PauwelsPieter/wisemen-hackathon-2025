import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { UserEvent } from '../../events/user.event.js'
import { RegisterDomainEvent } from '../../../../modules/domain-events/register-domain-event.decorator.js'
import { RoleUuid } from '../../../roles/entities/role.uuid.js'
import { UserUuid } from '../../entities/user.uuid.js'

@OneOfMeta(DomainEventLog, DomainEventType.USER_ROLE_ASSIGNED)
export class RoleAssignedToUserEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly userUuid: UserUuid

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly roleUuid: RoleUuid

  constructor (userUuid: UserUuid, roleUuid: RoleUuid) {
    this.userUuid = userUuid
    this.roleUuid = roleUuid
  }
}

@RegisterDomainEvent(DomainEventType.USER_ROLE_ASSIGNED, 1)
export class RoleAssignedToUserEvent extends UserEvent<RoleAssignedToUserEventContent> {
  constructor (userUuid: UserUuid, roleUuid: RoleUuid) {
    super({
      userUuid,
      content: new RoleAssignedToUserEventContent(userUuid, roleUuid)
    })
  }
}
