import { Injectable } from '@nestjs/common'
import { JobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { TypesenseCollectionService } from '../../services/typesense-collection.service.js'
import { SyncTypesenseJob, SyncTypesenseJobData } from './sync-typesense.job.js'
import { TypesenseSyncRepository } from './typesense-sync.repository.js'

@Injectable()
@PgBossJobHandler(SyncTypesenseJob)
export class SyncTypesenseHandler extends JobHandler<SyncTypesenseJob> {
  constructor (
    private readonly syncRepository: TypesenseSyncRepository,
    private readonly collectionService: TypesenseCollectionService
  ) {
    super()
  }

  async run (data: SyncTypesenseJobData): Promise<void> {
    const lastSyncedAt = await this.syncRepository.fetchLastSyncedAt(data.collectionName)

    const newSyncedAt = new Date()

    if (lastSyncedAt === null) {
      await this.collectionService.import(data.collectionName)
    } else {
      await this.collectionService.importChanged(data.collectionName, lastSyncedAt)
      await this.collectionService.deleteRemoved(data.collectionName, lastSyncedAt)
    }

    await this.syncRepository.updateLastSyncedAt(data.collectionName, newSyncedAt)
  }
}
