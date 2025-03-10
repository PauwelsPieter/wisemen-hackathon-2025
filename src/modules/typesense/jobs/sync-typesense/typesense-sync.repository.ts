import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { TypesenseSync } from './typesense-sync.entity.js'

@Injectable()
export class TypesenseSyncRepository {
  constructor (
    @InjectRepository(TypesenseSync) private readonly syncRepository: Repository<TypesenseSync>
  ) {}

  async fetchLastSyncedAt (forCollection: TypesenseCollectionName): Promise<Date | null> {
    const sync = await this.syncRepository.findOneBy({ collection: forCollection })

    return sync?.lastSyncedAt ?? null
  }

  async updateLastSyncedAt (forCollection: TypesenseCollectionName, at: Date): Promise<void> {
    await this.syncRepository.upsert(
      { collection: forCollection, lastSyncedAt: at },
      { conflictPaths: { collection: true } }
    )
  }
}
