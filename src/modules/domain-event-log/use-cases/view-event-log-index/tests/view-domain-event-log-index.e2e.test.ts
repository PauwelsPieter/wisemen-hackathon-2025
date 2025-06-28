import { after, afterEach, before, describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { expect } from 'expect'
import { HttpStatus } from '@nestjs/common'
import { stringify } from 'qs'
import { DomainEventLogEntityBuilder } from '../../../domain-event-log.entity.builder.js'
import { DomainEventLog } from '../../../domain-event-log.entity.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { ViewDomainEventLogIndexQueryBuilder } from '../view-domain-event-log-index.query.builder.js'
import { DomainEventSubjectType } from '../../../../domain-events/domain-event-subject-type.enum.js'
import { generateUuid } from '../../../../../utils/types/uuid.js'
import { UserUuid } from '../../../../../app/users/entities/user.uuid.js'

describe('Get domain event logs end to end tests', () => {
  let setup: EndToEndTestSetup
  let token: string

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    token = (await setup.authContext.getAdminUser()).token
  })

  after(async () => await setup.teardown())
  afterEach(async () => await setup.dataSource.manager.clear(DomainEventLog))

  it('responds with the event logs', async () => {
    const log = new DomainEventLogEntityBuilder().build()
    await setup.dataSource.manager.insert(DomainEventLog, log)

    const query = new ViewDomainEventLogIndexQueryBuilder().build()

    const response = await request(setup.httpServer)
      .get('/event-logs')
      .set('Authorization', `Bearer ${token}`)
      .query(stringify(query))

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

  it('filters the results on subject type', async () => {
    const userLog = new DomainEventLogEntityBuilder()
      .withSubjectType(DomainEventSubjectType.USER)
      .build()

    const otherLog = new DomainEventLogEntityBuilder()
      .withSubjectType(null)
      .build()

    await setup.dataSource.manager.insert(DomainEventLog, [userLog, otherLog])

    const query = new ViewDomainEventLogIndexQueryBuilder()
      .withSubjectType(DomainEventSubjectType.USER)
      .build()

    const response = await request(setup.httpServer)
      .get('/event-logs')
      .set('Authorization', `Bearer ${token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(HttpStatus.OK)
    expect(response.body.items).toStrictEqual([expect.objectContaining({ uuid: userLog.uuid })])
  })

  it('filters the results on subject id', async () => {
    const subjectLog = new DomainEventLogEntityBuilder()
      .withSubjectId(randomUUID())
      .build()

    const otherLog = new DomainEventLogEntityBuilder()
      .withSubjectId(null)
      .build()

    await setup.dataSource.manager.insert(DomainEventLog, [subjectLog, otherLog])

    const query = new ViewDomainEventLogIndexQueryBuilder()
      .withSubjectId(subjectLog.subjectId ?? '')
      .build()

    const response = await request(setup.httpServer)
      .get('/event-logs')
      .set('Authorization', `Bearer ${token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(HttpStatus.OK)
    expect(response.body.items).toStrictEqual([expect.objectContaining({ uuid: subjectLog.uuid })])
  })

  it('filters the results on user uuid', async () => {
    const userLog = new DomainEventLogEntityBuilder()
      .withUserUuid(generateUuid<UserUuid>())
      .build()

    const otherLog = new DomainEventLogEntityBuilder()
      .withUserUuid(null)
      .build()

    await setup.dataSource.manager.insert(DomainEventLog, [userLog, otherLog])

    const query = new ViewDomainEventLogIndexQueryBuilder()
      .withUserUuid(userLog.userUuid ?? '')
      .build()

    const response = await request(setup.httpServer)
      .get('/event-logs')
      .set('Authorization', `Bearer ${token}`)
      .query(stringify(query))

    expect(response).toHaveStatus(HttpStatus.OK)
    expect(response.body.items).toStrictEqual([expect.objectContaining({ uuid: userLog.uuid })])
  })
})
