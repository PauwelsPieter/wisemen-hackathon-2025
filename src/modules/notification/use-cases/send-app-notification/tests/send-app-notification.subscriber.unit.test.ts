import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { SendAppNotificationSubscriber } from '../send-app-notification.subscriber.js'
import { NatsPublisher } from '../../../../nats/outbox/nats-publisher/nats-publisher.js'
import { UserNotificationCreatedEvent } from '../../create-user-notifications/user-notification.created.event.js'
import { UserNotificationEntityBuilder } from '../../../entity-builders/user-notification.entity.builder.js'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'

describe('SendAppNotificationSubscriber - Unit Tests', () => {
  before(() => TestBench.setupUnitTest())

  it('Only published app events on nats', async () => {
    const natsPublisher = createStubInstance(NatsPublisher)

    const subscriber = new SendAppNotificationSubscriber(natsPublisher)
    await subscriber.on([
      new UserNotificationCreatedEvent(
        new UserNotificationEntityBuilder()
          .withChannel(NotificationChannel.APP)
          .build()
      ),
      new UserNotificationCreatedEvent(
        new UserNotificationEntityBuilder()
          .withChannel(NotificationChannel.PUSH)
          .build()
      )
    ])

    expect(natsPublisher.publish.firstCall.args).toHaveLength(1)
  })
})
