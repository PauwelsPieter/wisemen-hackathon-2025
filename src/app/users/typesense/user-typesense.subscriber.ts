import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { UserCreatedEvent } from '../use-cases/get-or-create-user/user-created.event.js'
import { SyncTypesenseJob } from '../../../modules/typesense/jobs/sync-typesense/sync-typesense.job.js'
import { Subscribe } from '../../../modules/events/subscribe.decorator.js'
import { TypesenseCollectionName } from '../../../modules/typesense/enums/typesense-collection-index.enum.js'

@Injectable()
export class UserTypesenseSubscriber {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  @Subscribe(UserCreatedEvent)
  async handle (): Promise<void> {
    const job = new SyncTypesenseJob(TypesenseCollectionName.USER)

    await this.jobScheduler.scheduleJob(job)
  }
}
