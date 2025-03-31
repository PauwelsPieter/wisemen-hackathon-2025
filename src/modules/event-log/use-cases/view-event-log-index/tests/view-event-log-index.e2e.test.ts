import { after, before, describe, it } from 'node:test'
import request from 'supertest'
import { expect } from 'expect'
import { HttpStatus } from '@nestjs/common'
import { stringify } from 'qs'
import { EventLogEntityBuilder } from '../../../event-log.entity.builder.js'
import { EventLog } from '../../../event-log.entity.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { ViewEventLogIndexQueryBuilder } from '../view-event-log-index.query.builder.js'

describe('Get event logs end to end tests', () => {
  let setup: EndToEndTestSetup
  let token: string

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    token = (await setup.authContext.getAdminUser()).token
  })

  after(async () => await setup.teardown())

  it('responds with the event logs', async () => {
    const log = new EventLogEntityBuilder().build()

    await setup.dataSource.manager.insert(EventLog, log)

    const query = new ViewEventLogIndexQueryBuilder().build()

    const response = await request(setup.httpServer)
      .get('/event-logs')
      .set('Authorization', `Bearer ${token}`)
      .send(stringify(query))

    expect(response).toHaveStatus(HttpStatus.OK)
    expect(response.body).toStrictEqual({
      items: [expect.objectContaining({
        uuid: log.uuid,
        createdAt: log.createdAt.toISOString(),
        type: log.type,
        content: log.content,
        userUuid: log.userUuid,
        version: log.version
      })],
      meta: {
        next: {
          createdAt: log.createdAt.toISOString(),
          uuid: log.uuid
        }
      }
    })
  })
})
