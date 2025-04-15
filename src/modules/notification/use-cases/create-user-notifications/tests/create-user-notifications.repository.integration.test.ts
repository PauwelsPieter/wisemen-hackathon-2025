import { after, before, describe, it } from 'node:test'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js'
import { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { expect } from 'expect'
import { RepositoryTestSetup } from '../../../../../../test/setup/repository-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { UserEntityBuilder } from '../../../../../app/users/tests/user-entity.builder.js'
import { UserNotification } from '../../../entities/user-notification.entity.js'
import { NotificationEntityBuilder } from '../../../entity-builders/notification.entity.builder.js'
import { NotificationChannel } from '../../../enums/notification-channel.enum.js'
import { NotificationPreset } from '../../../enums/notification-preset.enum.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { User } from '../../../../../app/users/entities/user.entity.js'
import { CreateUserNotificationsRepository } from '../create-user-notifications.repository.js'
import { Notification } from '../../../entities/notification.entity.js'
import { NotificationPreferences } from '../../../entities/notification-preferences.entity.js'
import { NotificationPreferencesPresetEntityBuilder } from '../../../entity-builders/notification-preferences-preset.entity.builder.js'
import { NotificationPreferencesEntityBuilder } from '../../../entity-builders/notification-preferences.entity.builder.js'
import { NotificationPreferencesPreset } from '../../../entities/notification-preferences-preset.entity.js'

describe('SendAppNotificationRepository - Integration Tests', () => {
  let setup: RepositoryTestSetup
  let repository: CreateUserNotificationsRepository
  let user1: User
  let user2: User
  let userNonePreset: User
  let userAllPreset: User
  let userDefaultPreset: User
  let notification: Notification

  before(async () => {
    setup = await TestBench.setupRepositoryTest()
    repository = new CreateUserNotificationsRepository(
      new TypeOrmRepository(Notification, setup.dataSource.manager),
      new TypeOrmRepository(UserNotification, setup.dataSource.manager),
      new TypeOrmRepository(NotificationPreferencesPreset, setup.dataSource.manager)
    )

    user1 = new UserEntityBuilder().withEmail('user1@email.com').build()
    user2 = new UserEntityBuilder().withEmail('user2@email.com').build()
    userNonePreset = new UserEntityBuilder().withEmail('userNone@email.com').build()
    userAllPreset = new UserEntityBuilder().withEmail('userAll@email.com').build()
    userDefaultPreset = new UserEntityBuilder().withEmail('userDefault@email.com').build()

    const notificationPresetPreferenceUser1 = new NotificationPreferencesPresetEntityBuilder()
      .withUserUuid(user1.uuid)
      .withPreset(NotificationPreset.CUSTOM)
      .build()

    const notificationPresetPreferenceUser2 = new NotificationPreferencesPresetEntityBuilder()
      .withUserUuid(user2.uuid)
      .withPreset(NotificationPreset.CUSTOM)
      .build()

    const notificationPresetPreferenceNone = new NotificationPreferencesPresetEntityBuilder()
      .withUserUuid(userNonePreset.uuid)
      .withPreset(NotificationPreset.NONE)
      .build()

    const notificationPresetPreferenceAll = new NotificationPreferencesPresetEntityBuilder()
      .withUserUuid(userAllPreset.uuid)
      .withPreset(NotificationPreset.ALL)
      .build()

    const notificationPresetPreferenceDefault = new NotificationPreferencesPresetEntityBuilder()
      .withUserUuid(userDefaultPreset.uuid)
      .withPreset(NotificationPreset.DEFAULT)
      .build()

    notification = new NotificationEntityBuilder()
      .withType(NotificationType.USER_CREATED)
      .withMeta({ userName: 'John Doe' })
      .withCreatedByUserUuid(user1.uuid)
      .build()

    const user1AppPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user1.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const user1PushPreference2 = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user1.uuid)
      .withChannel(NotificationChannel.PUSH)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const user2AppPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user2.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const user2PushPreference2 = new NotificationPreferencesEntityBuilder()
      .withUserUuid(user2.uuid)
      .withChannel(NotificationChannel.PUSH)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const userNonePresetAppPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(userNonePreset.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const userNonePresetPushPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(userNonePreset.uuid)
      .withChannel(NotificationChannel.PUSH)
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const userAllPresetNotificationPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(userAllPreset.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([])
      .build()

    const userDefaultPresetNotificationPreference = new NotificationPreferencesEntityBuilder()
      .withUserUuid(userDefaultPreset.uuid)
      .withChannel(NotificationChannel.APP)
      .withTypes([])
      .build()

    await setup.dataSource.manager.insert(User, [
      user1, user2, userNonePreset,
      userAllPreset, userDefaultPreset
    ])
    await setup.dataSource.manager.insert(NotificationPreferencesPreset, [
      notificationPresetPreferenceUser1,
      notificationPresetPreferenceUser2,
      notificationPresetPreferenceNone,
      notificationPresetPreferenceAll,
      notificationPresetPreferenceDefault
    ])
    await setup.dataSource.manager
      .insert(Notification, notification as QueryDeepPartialEntity<Notification>)
    await setup.dataSource.manager.insert(NotificationPreferences, [
      user1AppPreference,
      user1PushPreference2,
      user2AppPreference,
      user2PushPreference2,
      userNonePresetAppPreference,
      userNonePresetPushPreference,
      userAllPresetNotificationPreference,
      userDefaultPresetNotificationPreference
    ])
  })

  after(async () => await setup.teardown())

  it(`Returns all users which have preset ALL, DEFAULT or CUSTOM with the notification type enabled. It excludes the creator of the notification`, async () => {
    const generator = repository.getSubscribedUsers({
      channel: NotificationChannel.APP,
      notification,
      includeUsersWithDefaultPreset: true,
      batchSize: 10
    })

    for await (const users of generator) {
      expect(users).toHaveLength(3)
      expect(users).toEqual(
        expect.arrayContaining([
          { uuid: user2.uuid },
          { uuid: userAllPreset.uuid },
          { uuid: userDefaultPreset.uuid }
        ])
      )
    }
  })

  it(`Excludes all users which have preset DEFAULT when the notification is not enabled by default`, async () => {
    const generator = repository.getSubscribedUsers({
      batchSize: 10,
      channel: NotificationChannel.APP,
      includeUsersWithDefaultPreset: false,
      notification
    })

    for await (const users of generator) {
      expect(users).toHaveLength(2)
      expect(users).toEqual(
        expect.arrayContaining([
          { uuid: user2.uuid },
          { uuid: userAllPreset.uuid }
        ])
      )
    }
  })
})
