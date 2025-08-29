import { ApiProperty } from '@nestjs/swagger'
import { AirportUuid } from '../../../../app/airport/entities/airport.uuid.js'
import { TypesenseAirport } from '../../../../app/airport/typesense/typesense-airport.js'

export class SearchCollectionAirportResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: AirportUuid

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  code: string

  constructor (airport: TypesenseAirport) {
    this.uuid = airport.id
    this.name = airport.name
    this.code = airport.code
  }
}
