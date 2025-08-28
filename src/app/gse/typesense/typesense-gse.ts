import { AirportUuid } from '../../airport/entities/airport.uuid.js'
import { Gse } from '../entities/gse.entity.js'
import { GseUuid } from '../entities/gse.uuid.js'
import { GseType } from '../enums/gse-type.enum.js'

export class TypesenseGse {
  id: GseUuid
  airportUuid?: AirportUuid
  type: GseType
  soc: number
  temperatureCelsius: number
  location: [number, number]

  constructor (gse: Gse) {
    return {
      id: gse.uuid,
      airportUuid: gse.airportUuid!,
      type: gse.type,
      soc: gse.soc,
      temperatureCelsius: gse.temperatureCelsius,
      location: [gse.location.coordinates[0], gse.location.coordinates[1]]
    }
  }
}
