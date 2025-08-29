import { ApiProperty } from '@nestjs/swagger'
import { GseUuid } from '../../../../app/gse/entities/gse.uuid.js'
import { AirportUuid } from '../../../../app/airport/entities/airport.uuid.js'
import { GseType } from '../../../../app/gse/enums/gse-type.enum.js'
import { GseAirportSchema, TypesenseGse } from '../../../../app/gse/typesense/typesense-gse.js'

export class LocationResponse {
  longitude: number
  latitude: number

  constructor (gse: TypesenseGse) {
    this.longitude = gse.location[1]
    this.latitude = gse.location[0]
  }
}

export class AirportResponse {
  uuid: AirportUuid
  name: string

  constructor (airport: GseAirportSchema) {
    this.uuid = airport.id
    this.name = airport.name
  }
}

export class SearchCollectionGseResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: GseUuid

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  airportUuid: AirportUuid | null

  @ApiProperty({ type: String, enumName: 'GseType', enum: GseType })
  type: GseType

  @ApiProperty({ type: Number })
  soc: number

  @ApiProperty({ type: Number })
  temperatureCelsius: number

  @ApiProperty({ type: LocationResponse })
  location: LocationResponse

  @ApiProperty({ type: AirportResponse })
  airport: AirportResponse | null

  constructor (gse: TypesenseGse) {
    this.uuid = gse.id
    this.airportUuid = gse.airportUuid ?? null
    this.type = gse.type
    this.soc = gse.soc
    this.temperatureCelsius = gse.temperature
    this.location = new LocationResponse(gse)
    this.airport = gse.airport !== undefined ? new AirportResponse(gse.airport) : null
  }
}
