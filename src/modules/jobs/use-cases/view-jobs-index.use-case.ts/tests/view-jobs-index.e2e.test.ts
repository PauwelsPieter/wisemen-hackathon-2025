import { after, before, it, describe, afterEach } from 'node:test'
import request from 'supertest'
import { stringify } from 'qs'
import { expect } from 'expect'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TestAuthContext } from '../../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { ViewJobIndexQueryBuilder } from '../query/view-jobs-index.query-builder.js'
import { SyncTypesenseJob } from '../../../../typesense/jobs/sync-typesense/sync-typesense.job.js'
import { TypesenseCollectionName } from '../../../../typesense/enums/typesense-collection-index.enum.js'
import { QueueName } from '../../../../pgboss/enums/queue-name.enum.js'
import { ViewJobsIndexQueryKey } from '../query/view-jobs-index.query-key.js'

describe('View job index end to end tests', () => {
  let setup: EndToEndTestSetup
  let context: TestAuthContext
  let adminUser: TestUser
  let jobScheduler: PgBossScheduler

  before(async () => {
    setup = await TestBench.setupEndToEndTest()
    context = setup.authContext

    adminUser = await context.getAdminUser()
    jobScheduler = setup.testModule.get(PgBossScheduler, { strict: false })
  })

  after(async () => await setup.teardown())
  afterEach(async () => {
    await setup.dataSource.manager.delete('pgboss.job', {})
  })

  it('responds with jobs', async () => {
    await jobScheduler.scheduleJob(new SyncTypesenseJob(TypesenseCollectionName.USER))

    const query = new ViewJobIndexQueryBuilder().build()

    const response = await request(setup.httpServer)
      .get('/jobs')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      items: [expect.objectContaining({
        queueName: expect.isEnumValue(QueueName),
        id: expect.any(String),
        jobName: SyncTypesenseJob.name,
        createdAt: expect.ISO8601(),
        completedAt: null
      })]
    }))
  })

  it('responds with the next jobs when giving the next key', async () => {
    await jobScheduler.scheduleJobs([
      new SyncTypesenseJob(TypesenseCollectionName.USER),
      new SyncTypesenseJob(TypesenseCollectionName.USER)
    ])

    const query = new ViewJobIndexQueryBuilder()
      .withLimit(1)
      .build()

    const response = await request(setup.httpServer)
      .get('/jobs')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      meta: {
        next: expect.anything()
      }
    }))

    const key = response.body.meta.next as ViewJobsIndexQueryKey
    const nextQuery = new ViewJobIndexQueryBuilder()
      .withKey(key)
      .withLimit(1)
      .build()

    const nextResponse = await request(setup.httpServer)
      .get('/jobs')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(stringify(nextQuery))

    expect(nextResponse).toHaveStatus(200)
    expect(nextResponse.body).toStrictEqual(expect.objectContaining({
      items: [expect.objectContaining({
        queueName: expect.isEnumValue(QueueName),
        id: expect.any(String),
        jobName: SyncTypesenseJob.name,
        createdAt: expect.ISO8601(),
        completedAt: null
      })]
    }))
  })

  it('responds with archived jobs', async () => {
    const query = new ViewJobIndexQueryBuilder()
      .withArchived(true)
      .build()

    const response = await request(setup.httpServer)
      .get('/jobs')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(stringify(query))

    expect(response).toHaveStatus(200)
    expect(response.body).toStrictEqual(expect.objectContaining({
      items: []
    }))
  })
})
