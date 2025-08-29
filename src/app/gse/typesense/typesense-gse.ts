import { Gse } from '../entities/gse.entity.js'
import { GseUuid } from '../entities/gse.uuid.js'
import { GseType } from '../enums/gse-type.enum.js'

export class TypesenseGse {
  id: GseUuid
  airportUuid?: string
  airportCode?: string
  airportName?: string
  type: GseType
  soc: number
  temperature: number

  constructor (gse: Gse) {
    return {
      id: gse.uuid,
      airportUuid: gse.airport?.uuid,
      airportCode: gse.airport?.code,
      airportName: gse.airport?.name,
      type: gse.type,
      soc: gse.soc,
      temperature: gse.temperatureCelsius
    }
  }
}
