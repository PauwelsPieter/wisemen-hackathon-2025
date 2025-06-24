import { ApiProperty } from '@nestjs/swagger'
import { CoordinatesResponse } from '@wisemen/coordinates'
import { Address } from './address.js'

export class AddressResponse {
  @ApiProperty({ type: 'string', nullable: true })
  country: string | null

  @ApiProperty({ type: 'string', nullable: true })
  city: string | null

  @ApiProperty({ type: 'string', nullable: true })
  postalCode: string | null

  @ApiProperty({ type: 'string', nullable: true })
  streetName: string | null

  @ApiProperty({ type: 'string', nullable: true })
  streetNumber: string | null

  @ApiProperty({ type: 'string', nullable: true })
  unit: string | null

  @ApiProperty({ type: CoordinatesResponse, nullable: true })
  coordinates: CoordinatesResponse | null

  constructor (address: Address) {
    this.country = address.country ?? null
    this.city = address.city ?? null
    this.postalCode = address.postalCode ?? null
    this.streetName = address.streetName ?? null
    this.streetNumber = address.streetNumber ?? null
    this.unit = address.unit ?? null
    this.coordinates = address.coordinates != null
      ? new CoordinatesResponse(address.coordinates)
      : null
  }
}
