import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { AssignDefaultNotificationPreferencesToUserUseCase } from '../assign-default-notification-preferences-to-user.use-case.js'
import { AssignDefaultNotificationPreferencesToUserRepository } from '../assign-default-notification-preferences-to-user.repository.js'
import { DefaultNotificationPreferencesAssignedToUserEvent } from '../default-notification-preferences-assigned-to-user.event.js'

import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { UserNotFoundError } from '../../../../../app/users/errors/user-not-found.error.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'
import { generateUserUuid } from '../../../../../app/users/entities/user.uuid.js'

describe('Assign default preferences to user use case unit test', () => {
  before(() => TestBench.setupUnitTest())

  it('throws an error when the user does not exist', async () => {
    const repository = createStubInstance(AssignDefaultNotificationPreferencesToUserRepository)
    repository.userExists.resolves(false)

    const useCase = new AssignDefaultNotificationPreferencesToUserUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      repository
    )

    const userUuid = generateUserUuid()

    await expect(useCase.assignDefaultPreferences(userUuid))
      .rejects.toThrow(new UserNotFoundError(userUuid))
  })

  it('emits an event when the default preferences are assigned', async () => {
    const repository = createStubInstance(AssignDefaultNotificationPreferencesToUserRepository)
    repository.userExists.resolves(true)
    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new AssignDefaultNotificationPreferencesToUserUseCase(
      stubDataSource(),
      eventEmitter,
      repository
    )

    const userUuid = generateUserUuid()
    await useCase.assignDefaultPreferences(userUuid)

    const expectedEvent = new DefaultNotificationPreferencesAssignedToUserEvent(userUuid)
    expect(eventEmitter).toHaveEmitted(expectedEvent)
  })
})
