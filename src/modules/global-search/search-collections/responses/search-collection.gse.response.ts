import { ApiProperty } from '@nestjs/swagger'
import { GseUuid } from '../../../../app/gse/entities/gse.uuid.js'
import { GseType } from '../../../../app/gse/enums/gse-type.enum.js'
import { TypesenseGse } from '../../../../app/gse/typesense/typesense-gse.js'

export class SearchCollectionGseResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: GseUuid

  @ApiProperty({ type: String, nullable: true })
  airportCode: string | null

  @ApiProperty({ type: String, nullable: true })
  airportName: string | null

  @ApiProperty({ type: String, enumName: 'GseType', enum: GseType })
  type: GseType

  @ApiProperty({ type: Number })
  soc: number

  @ApiProperty({ type: Number })
  temperatureCelsius: number

  constructor (gse: TypesenseGse) {
    this.uuid = gse.id
    this.airportCode = gse.airportCode ?? null
    this.airportName = gse.airportName ?? null
    this.type = gse.type
    this.soc = gse.soc
    this.temperatureCelsius = gse.temperature
  }
}
