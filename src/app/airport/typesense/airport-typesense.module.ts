import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Airport } from '../entities/airport.entity.js'
import { AirportTypesenseCollector } from './airport-typesense.collector.js'
import { AirportTypesenseCollection } from './airport.collections.js'

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  providers: [
    AirportTypesenseCollector,
    AirportTypesenseCollection
  ]
})
export class TypesenseAirportModule {}
