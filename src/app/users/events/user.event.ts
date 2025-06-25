import { DomainEvent, SubjectedEventOptions } from '../../../modules/domain-events/domain-event.js'
import { DomainEventSubjectType } from '../../../modules/domain-events/domain-event-subject-type.enum.js'
import { UserUuid } from '../entities/user.uuid.js'

export class UserEvent<Content extends object> extends DomainEvent<Content> {
  constructor (options: SubjectedEventOptions<Content, { userUuid: UserUuid }>) {
    super({
      ...options,
      subjectId: options.userUuid,
      subjectType: DomainEventSubjectType.USER
    })
  }
}
