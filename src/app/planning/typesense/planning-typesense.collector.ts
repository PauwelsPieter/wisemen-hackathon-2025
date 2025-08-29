import { AnyOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { RegisterTypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.decorator.js'
import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.js'
import { Planning } from '../entities/planning.entity.js'
import { PlanningUuid } from '../entities/planning.uuid.js'
import { TypesensePlanning } from './typesense-planning.js'

@RegisterTypesenseCollector(TypesenseCollectionName.PLANNING)
export class PlanningTypesenseCollector implements TypesenseCollector {
  constructor (
    @InjectRepository(Planning) private readonly planningRepository: Repository<Planning>
  ) {}

  transform (planning: Planning[]): TypesensePlanning[] {
    return planning.map(Planning => new TypesensePlanning(Planning))
  }

  async fetch (uuids?: PlanningUuid[]): Promise<Planning[]> {
    return await this.planningRepository.find({
      where: { uuid: AnyOrIgnore(uuids) }
    })
  }

  async fetchChanged (since: Date): Promise<Planning[]> {
    return await this.planningRepository.find({
      where: [
        { updatedAt: MoreThanOrEqual(since) }
      ]
    })
  }

  async fetchRemoved (_since: Date): Promise<string[]> {
    return Promise.resolve([])
  }
}
