import { AnyOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { Airport } from '../entities/Airport.entity.js'
import { AirportUuid } from '../entities/Airport.uuid.js'
import { RegisterTypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.decorator.js'
import { TypesenseCollectionName } from '../../../modules/typesense/collections/typesense-collection-name.enum.js'
import { TypesenseCollector } from '../../../modules/typesense/collectors/typesense-collector.js'
import { TypesenseAirport } from './typesense-airport.js'

@RegisterTypesenseCollector(TypesenseCollectionName.AIRPORT)
export class AirportTypesenseCollector implements TypesenseCollector {
  constructor (
    @InjectRepository(Airport) private readonly AirportRepository: Repository<Airport>
  ) {}

  transform (Airports: Airport[]): TypesenseAirport[] {
    return Airports.map(Airport => new TypesenseAirport(Airport))
  }

  async fetch (uuids?: AirportUuid[]): Promise<Airport[]> {
    return await this.AirportRepository.find({
      where: { uuid: AnyOrIgnore(uuids) }
    })
  }

  async fetchChanged (since: Date): Promise<Airport[]> {
    return await this.AirportRepository.find({
      where: [
        { updatedAt: MoreThanOrEqual(since) }
      ]
    })
  }

  async fetchRemoved (_since: Date): Promise<string[]> {
    return Promise.resolve([])
  }
}
