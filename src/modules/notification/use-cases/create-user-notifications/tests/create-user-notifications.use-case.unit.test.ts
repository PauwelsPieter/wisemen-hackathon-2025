import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { NotificationEntityBuilder } from '../../../entity-builders/notification.entity.builder.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { CreateUserNotificationsRepository } from '../create-user-notifications.repository.js'
import { CreateUserNotificationsUseCase } from '../create-user-notifications.use-case.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'
import { generateUserUuid } from '../../../../../app/users/entities/user.uuid.js'

describe('CreateUserNotificationsUseCase - Unit Tests', () => {
  before(() => TestBench.setupUnitTest())

  it('Creates 2 notifications for 2 subscribed users', async () => {
    const repo = createStubInstance(CreateUserNotificationsRepository)

    const notification = new NotificationEntityBuilder()
      .withType(NotificationType.USER_CREATED)
      .withMeta({ userName: 'John Doe' })
      .withCreatedByUserUuid(generateUserUuid())
      .build()

    repo.findNotificationOrFail.resolves(notification)

    repo.getSubscribedUsers.callsFake(
      async function*() {
        yield await new Promise(res => res([
          { uuid: generateUserUuid() },
          { uuid: generateUserUuid() }
        ]))
      }
    )

    const useCase = new CreateUserNotificationsUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      repo
    )

    await useCase.execute(notification.uuid)

    expect(repo.insertUserNotifications.firstCall.firstArg).toHaveLength(2)
  })

  it('Emits 2 events for 2 subscribers', async () => {
    const repo = createStubInstance(CreateUserNotificationsRepository)

    const notification = new NotificationEntityBuilder()
      .withType(NotificationType.USER_CREATED)
      .withMeta({ userName: 'John Doe' })
      .withCreatedByUserUuid(generateUserUuid())
      .build()

    repo.findNotificationOrFail.resolves(notification)

    repo.getSubscribedUsers.callsFake(
      async function*() {
        yield await new Promise(res => res([
          { uuid: generateUserUuid() },
          { uuid: generateUserUuid() }
        ]))
      }
    )

    const eventEmitter = createStubInstance(DomainEventEmitter)
    const useCase = new CreateUserNotificationsUseCase(
      stubDataSource(),
      eventEmitter,
      repo
    )

    await useCase.execute(notification.uuid)

    expect(eventEmitter.emit.firstCall.firstArg).toHaveLength(2)
  })
})
