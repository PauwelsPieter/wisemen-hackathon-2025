import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { Repository } from 'typeorm'
import { expect } from 'expect'
import { CreateNotificationUseCase } from '../create-notification.use-case.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { Notification } from '../../../entities/notification.entity.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationCreatedEvent } from '../notification-created.event.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { DomainEventEmitter } from '../../../../domain-events/domain-event-emitter.js'

describe('CreateNotificationUseCase - Unit Tests', () => {
  before(() => TestBench.setupUnitTest())

  it('Emits a NotificationCreated event and job', async () => {
    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new CreateNotificationUseCase(
      stubDataSource(),
      eventEmitter,
      createStubInstance(Repository<Notification>)
    )

    const type = NotificationType.USER_CREATED
    const { uuid } = await useCase.createNotification(null, type, { someKey: 'someValue' })

    expect(eventEmitter).toHaveEmitted(new NotificationCreatedEvent(uuid, type))
  })
})
