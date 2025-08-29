import { ApiProperty } from '@nestjs/swagger'
import { GseUuid } from '../../../../app/gse/entities/gse.uuid.js'
import { AirportUuid } from '../../../../app/airport/entities/airport.uuid.js'
import { GseType } from '../../../../app/gse/enums/gse-type.enum.js'
import { TypesenseGse } from '../../../../app/gse/typesense/typesense-gse.js'

export class LocationResponse {
  longitude: string
  latitude: string

  constructor (gse: TypesenseGse) {
    this.longitude = gse.longitude
    this.latitude = gse.latitude
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

  constructor (gse: TypesenseGse) {
    this.uuid = gse.id
    this.airportUuid = gse.airportUuid ?? null
    this.type = gse.type
    this.soc = gse.soc
    this.temperatureCelsius = gse.temperatureCelsius
    this.location = new LocationResponse(gse)
  }
}
