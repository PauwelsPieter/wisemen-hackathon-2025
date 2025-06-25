import { DomainEventSubjectType } from '../../../modules/domain-events/domain-event-subject-type.enum.js'
import { DomainEvent, SubjectedEventOptions } from '../../../modules/domain-events/domain-event.js'
import { RoleUuid } from '../entities/role.uuid.js'

export class RoleDomainEvent<Content extends object> extends DomainEvent<Content> {
  constructor (options: SubjectedEventOptions<Content, { roleUuid: RoleUuid }>) {
    super({
      ...options,
      subjectId: options.roleUuid,
      subjectType: DomainEventSubjectType.ROLE
    })
  }
}
