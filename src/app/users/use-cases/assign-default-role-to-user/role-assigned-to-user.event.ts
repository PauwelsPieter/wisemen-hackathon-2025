import { WiseEvent } from '../../../../modules/events/wise-event.js'

export class RoleAssignedToUserEventContent {
  readonly userUuid: string
  readonly roleUuid: string

  constructor (userUuid: string, roleUuid: string) {
    this.userUuid = userUuid
    this.roleUuid = roleUuid
  }
}

export class RoleAssignedToUserEvent extends WiseEvent {
  static VERSION = 1
  static TYPE = 'user.role-assigned'

  constructor (userUuid: string, roleUuid: string) {
    super({
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
