import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { Subscribe } from '../../../modules/domain-events/subscribe.decorator.js'
import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { SyncTypesenseJob } from '../../../modules/typesense/use-cases/sync-collection/sync-typesense-collection.job.js'
import { ContactCreatedEvent } from '../use-cases/create-contact/contact-created.event.js'
import { ContactUpdatedEvent } from '../use-cases/update-contact/contact-updated.event.js'
import { ContactDeletedEvent } from '../use-cases/delete-contact/contact-deleted.event.js'

@Injectable()
export class ContactTypesenseSubscriber {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  @Subscribe(ContactCreatedEvent)
  @Subscribe(ContactUpdatedEvent)
  @Subscribe(ContactDeletedEvent)
  async handle (): Promise<void> {
    const job = new SyncTypesenseJob(TypesenseCollectionName.CONTACT)
    await this.jobScheduler.scheduleJob(job)
  }
}
