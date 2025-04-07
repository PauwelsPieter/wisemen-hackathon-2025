import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { DomainEventType } from '../../../../modules/domain-events/domain-event-type.js'
import { DomainEventLog } from '../../../../modules/domain-event-log/domain-event-log.entity.js'
import { UserEvent } from '../../events/user-event.js'

@OneOfMeta(DomainEventLog, DomainEventType.USER_ROLE_ASSIGNED)
export class RoleAssignedToUserEventContent {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly userUuid: string

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly roleUuid: string

  constructor (userUuid: string, roleUuid: string) {
    this.userUuid = userUuid
    this.roleUuid = roleUuid
  }
}

export class RoleAssignedToUserEvent extends UserEvent<RoleAssignedToUserEventContent> {
  static VERSION = 1
  static TYPE = DomainEventType.USER_ROLE_ASSIGNED

  constructor (userUuid: string, roleUuid: string) {
    super({
      userUuid,
      version: RoleAssignedToUserEvent.VERSION,
      content: new RoleAssignedToUserEventContent(userUuid, roleUuid),
      type: RoleAssignedToUserEvent.TYPE
    })
  }
}
