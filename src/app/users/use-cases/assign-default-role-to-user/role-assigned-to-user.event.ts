import { OneOfMeta } from '@wisemen/one-of'
import { ApiProperty } from '@nestjs/swagger'
import { EventType } from '../../../../modules/events/event-type.js'
import { EventLog } from '../../../../modules/event-log/event-log.entity.js'
import { UserEvent } from '../../events/user-event.js'

@OneOfMeta(EventLog, EventType.USER_ROLE_ASSIGNED)
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
  static TYPE = EventType.USER_ROLE_ASSIGNED

  constructor (userUuid: string, roleUuid: string) {
    super({
      userUuid,
      topic: RoleAssignedToUserEvent.createTopic(userUuid, roleUuid),
      version: RoleAssignedToUserEvent.VERSION,
      content: new RoleAssignedToUserEventContent(userUuid, roleUuid),
      type: RoleAssignedToUserEvent.TYPE
    })
  }

  private static createTopic (userUuid: string, roleUuid: string): string {
    return `user.${userUuid}.role.${roleUuid}.assigned`
  }
}
