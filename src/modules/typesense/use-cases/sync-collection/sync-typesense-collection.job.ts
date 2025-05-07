import { BaseJob, BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import dayjs from 'dayjs'
import { QueueName } from '../../../pgboss/enums/queue-name.enum.js'
import { TypesenseCollectionName } from '../../collections/typesense-collection-name.enum.js'

export interface SyncTypesenseJobData extends BaseJobData {
  collectionName: TypesenseCollectionName
}

@PgBossJob(QueueName.SYSTEM)
export class SyncTypesenseJob extends BaseJob<SyncTypesenseJobData> {
  constructor (collectionName: TypesenseCollectionName) {
    const startAfter = dayjs().add(2, 'seconds').toDate()

    super({ collectionName }, {
      singletonKey: `sync-typesense-${collectionName}`,
      startAfter
    })
  }
}
