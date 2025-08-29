import { AirportUuid } from '../../airport/entities/airport.uuid.js'
import { Gse } from '../entities/gse.entity.js'
import { GseUuid } from '../entities/gse.uuid.js'
import { GseType } from '../enums/gse-type.enum.js'

export class GseAirportSchema {
  id: AirportUuid
  name: string
}

export class TypesenseGse {
  id: GseUuid
  airportUuid?: AirportUuid
  type: GseType
  soc: number
  temperature: number
  location: number[]

  airport?: GseAirportSchema

  constructor (gse: Gse) {
    return {
      id: gse.uuid,
      airportUuid: gse.airportUuid ?? undefined,
      type: gse.type,
      soc: gse.soc,
      temperature: gse.temperatureCelsius,
      location: [gse.location.coordinates[1], gse.location.coordinates[0]]
    }
  }
}
