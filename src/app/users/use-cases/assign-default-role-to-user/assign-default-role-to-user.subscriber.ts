import { Injectable } from '@nestjs/common'
import { UserCreatedEvent } from '../get-or-create-user/user-created.event.js'
import { Subscribe } from '../../../../modules/domain-events/subscribe.decorator.js'
import { AssignDefaultRoleToUserUseCase } from './assign-default-role-to-user.use-case.js'

@Injectable()
export class AssignDefaultRoleToUserSubscriber {
  constructor (
    private readonly useCase: AssignDefaultRoleToUserUseCase
  ) {}

  @Subscribe(UserCreatedEvent)
  async assignDefaultRole (events: UserCreatedEvent[]): Promise<void> {
    for (const event of events) {
      await this.useCase.assignDefaultRole(event.content.userUuid)
    }
  }
}
