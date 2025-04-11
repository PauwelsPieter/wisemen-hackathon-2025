import { after, before, it, describe, afterEach } from 'node:test'
import request from 'supertest'
import { stringify } from 'qs'
import { expect } from 'expect'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { EndToEndTestSetup } from '../../../../../../test/setup/end-to-end-test-setup.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { TestAuthContext } from '../../../../../../test/utils/test-auth-context.js'
import { TestUser } from '../../../../../app/users/tests/setup-user.type.js'
import { SyncTypesenseJob } from '../../../../typesense/jobs/sync-typesense/sync-typesense.job.js'
import { TypesenseCollectionName } from '../../../../typesense/enums/typesense-collection-index.enum.js'
import { ViewJobDetailQueryBuilder } from '../view-job-detail.query-builder.js'

describe('View job detail end to end tests', () => {
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

  it('responds with the details of a job', async () => {
    await jobScheduler.scheduleJob(new SyncTypesenseJob(TypesenseCollectionName.USER))
    const { id } = await setup.dataSource.manager.createQueryBuilder()
      .select('id')
      .from('pgboss.job', 'job')
      .getRawOne<{ id: string }>() ?? { id: '' }

    const query = new ViewJobDetailQueryBuilder().build()

    const response = await request(setup.httpServer)
      .get(`/jobs/${id}`)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .send(stringify(query))

    expect(response).toHaveStatus(200)
  })
})
