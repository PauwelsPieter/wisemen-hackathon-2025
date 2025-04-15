import { after, before, describe, it } from 'node:test'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { expect } from 'expect'
import { AddNewNotificationTypeToPreferenceRepository } from '../add-new-notification-type-to-preferences.repository.js'
import { NotificationPreferences } from '../../../entities/notification-preferences.entity.js'
import { NotificationPreferencesEntityBuilder } from '../../../entity-builders/notification-preferences.entity.builder.js'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { RepositoryTestSetup } from '../../../../../../test/setup/repository-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { UserEntityBuilder } from '../../../../../app/users/tests/user-entity.builder.js'
import { notificationCategory } from '../../../notification-category.js'
import { User } from '../../../../../app/users/entities/user.entity.js'

describe('AddNewNotificationTypeToPreferenceRepository - Integration Tests', () => {
  let setup: RepositoryTestSetup
  let repository: AddNewNotificationTypeToPreferenceRepository
  let user1AppPreference: NotificationPreferences
  let user1PushPreference: NotificationPreferences
  let user2AppPreference: NotificationPreferences
  let user2PushPreference: NotificationPreferences
  let user3PushPreference: NotificationPreferences
  let user3notificationPreference2: NotificationPreferences

  before(async () => {
    setup = await TestBench.setupRepositoryTest()
    repository = new AddNewNotificationTypeToPreferenceRepository(
      new TypeOrmRepository(NotificationPreferences, setup.dataSource.manager)
    )

    const user1 = new UserEntityBuilder().withEmail('user1@email.com').build()
    const user2 = new UserEntityBuilder().withEmail('user2@email.com').build()
    const user3 = new UserEntityBuilder().withEmail('user3@email.com').build()

    user1AppPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user1.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    user1PushPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user1.uuid)
      .withChannel(NotificationChannel.PUSH)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    user2AppPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user2.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([])
      .build()

    user2PushPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user2.uuid)
      .withChannel(NotificationChannel.PUSH)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    user3PushPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user3.uuid)
      .withChannel(NotificationChannel.PUSH)
      .withTypes([])
      .build()

    user3notificationPreference2 = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user3.uuid)
      .withChannel(NotificationChannel.EMAIL)
      .withTypes([])
      .build()

    await setup.dataSource.manager.insert(User, [user1, user2, user3])
    await setup.dataSource.manager.insert(NotificationPreferences, [
      user1AppPreference,
      user1PushPreference,
      user2AppPreference,
      user2PushPreference,
      user3PushPreference,
      user3notificationPreference2
    ])
  })

  after(async () => await setup.teardown())

  it(`Should return all notification preferences of the given channels`, async () => {
    const generator = repository.findAllPreferenceUuids(
      [NotificationChannel.APP, NotificationChannel.PUSH],
      10
    )

    for await (const uuids of generator) {
      expect(uuids).toHaveLength(5)
      expect(uuids).toEqual(
        expect.arrayContaining([
          user1AppPreference.uuid,
          user1PushPreference.uuid,
          user2AppPreference.uuid,
          user2PushPreference.uuid,
          user3PushPreference.uuid
        ])
      )
    }
  })

  it(`Should return all semi subscribed notification preferences of the given channels`, async () => {
    const generator = repository.findUserPreferencesAlreadySubscribedToCategory(
      notificationCategory(NotificationType.USER_CREATED),
      [NotificationChannel.APP, NotificationChannel.PUSH],
      10
    )

    for await (const uuids of generator) {
      expect(uuids).toHaveLength(3)
      expect(uuids).toEqual(
        expect.arrayContaining([
          user1AppPreference.uuid,
          user1PushPreference.uuid,
          user2PushPreference.uuid
        ])
      )
    }
  })
})
