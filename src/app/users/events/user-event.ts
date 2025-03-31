import { WiseEvent, WiseEventOptions } from '../../../modules/events/wise-event.js'
import { EventSubjectType } from '../../../modules/events/event-subject-type.enum.js'

export class UserEvent<Content extends object> extends WiseEvent<Content> {
  constructor (
    options: Omit<WiseEventOptions<Content>, 'subjectType' | 'subjectId'> & { userUuid: string }
  ) {
    super({
      ...options,
      subjectId: options.userUuid,
      subjectType: EventSubjectType.USER
    })
  }
}
