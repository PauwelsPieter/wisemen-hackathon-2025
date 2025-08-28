import { AnyOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { Gse } from '../entities/Gse.entity.js'
import { GseUuid } from '../entities/Gse.uuid.js'
import { RegisterTypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.decorator.js'
import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.js'
import { TypesenseGse } from './typesense-gse.js'

@RegisterTypesenseCollector(TypesenseCollectionName.GSE)
export class GseTypesenseCollector implements TypesenseCollector {
  constructor (
    @InjectRepository(Gse) private readonly GseRepository: Repository<Gse>
  ) {}

  transform (Gses: Gse[]): TypesenseGse[] {
    return Gses.map(Gse => new TypesenseGse(Gse))
  }

  async fetch (uuids?: GseUuid[]): Promise<Gse[]> {
    return await this.GseRepository.find({
      where: { uuid: AnyOrIgnore(uuids) }
    })
  }

  async fetchChanged (since: Date): Promise<Gse[]> {
    return await this.GseRepository.find({
      where: [
        { updatedAt: MoreThanOrEqual(since) }
      ]
    })
  }

  async fetchRemoved (_since: Date): Promise<string[]> {
    return Promise.resolve([])
  }
}
