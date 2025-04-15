import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { NotificationPreset } from '../../../enums/notification-preset.enum.js'
import { NotificationPreferencesPreset } from '../../../entities/notification-preferences-preset.entity.js'
import { UpdateMyNotificationPreferencePresetCommandBuilder } from '../update-my-notification-preference-preset.command.builder.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'

describe('Update notification preset preference e2e test', () => {
  let testSetup: EndToEndTestSetup
  let app: NestExpressApplication
  let dataSource: DataSource
  let adminUser: TestUser

  before(async () => {
    testSetup = await TestBench.setupEndToEndTest()
    dataSource = testSetup.dataSource
    app = testSetup.app

    adminUser = await testSetup.authContext.getAdminUser()
  })

  after(async () => {
    await testSetup.teardown()
  })

  it('should update notification preset preference', async () => {
    const command = new UpdateMyNotificationPreferencePresetCommandBuilder()
      .withPreset(NotificationPreset.ALL)
      .build()

    const response = await request(app.getHttpServer())
      .patch(`/me/notification-preferences/preset`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(204)

    const notificationPresetPreferences = await dataSource.manager.findOneOrFail(
      NotificationPreferencesPreset,
      {
        where: {
          userUuid: adminUser.user.uuid
        }
      }
    )

    expect(notificationPresetPreferences.preset).toBe(command.preset)
  })
})
