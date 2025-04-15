import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DataSource } from 'typeorm'
import { MigrateNotificationTypesCommandBuilder } from '../migrate-notification-types.command.builder.js'
import { NotificationType } from '../../../enums/notification-types.enum.js'
import { NotificationMigration } from '../../../entities/notification-migration.entity.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'

describe('Migrate notification e2e test', () => {
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

  it('should migrate new notification types', async () => {
    const command = new MigrateNotificationTypesCommandBuilder()
      .withTypes([NotificationType.USER_CREATED])
      .build()

    const response = await request(app.getHttpServer())
      .post(`/notifications/migrate`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(command)

    expect(response).toHaveStatus(204)

    const createdNotificationMigration = await dataSource.manager.findOne(NotificationMigration, {
      where: {
        type: NotificationType.USER_CREATED
      }
    })

    expect(createdNotificationMigration?.migratedAt).not.toBe(null)
  })
})
