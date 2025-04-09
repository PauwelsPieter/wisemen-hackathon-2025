import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNullable } from '@wisemen/validators'
import { CoordinatesCommand } from '@wisemen/coordinates'
import { AddressBuilder } from './address.builder.js'
import { Address } from './address.js'

export class AddressCommand {
  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  country: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  city: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  postalCode: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  streetName: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  streetNumber: string | null

  @ApiProperty({ type: 'string', nullable: true })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  unit: string | null

  @ApiProperty({ type: CoordinatesCommand })
  @IsObject()
  @Type(() => CoordinatesCommand)
  @ValidateNested()
  coordinates: CoordinatesCommand

  parse (): Address {
    return new AddressBuilder()
      .withCountry(this.country)
      .withCity(this.city)
      .withPostalCode(this.postalCode)
      .withStreetName(this.streetName)
      .withStreetNumber(this.streetNumber)
      .withUnit(this.unit)
      .withCoordinates(this.coordinates.toCoordinates())
      .build()
  }
}
