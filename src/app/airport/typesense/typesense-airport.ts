import { TypesenseGse } from '../../gse/typesense/typesense-gse.js'
import { Airport } from '../entities/airport.entity.js'
import { AirportUuid } from '../entities/airport.uuid.js'

export class TypesenseAirport {
  id: AirportUuid
  name: string
  code: string

  gses?: TypesenseGse[]

  constructor (airport: Airport) {
    return {
      id: airport.uuid,
      name: airport.name,
      code: airport.code
    }
  }
}
