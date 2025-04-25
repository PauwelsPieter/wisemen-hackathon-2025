import { IsEmail, IsPhoneNumber, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsDateWithoutTimeString, IsNullable } from '@wisemen/validators'
import { MonetaryDto, IsMonetary, Currency } from '@wisemen/monetary'
import { AddressCommand } from '../../../../utils/address/address-command.js'
import { IsAddress } from '../../../../utils/address/is-address.validator.js'
import { FileUuid } from '../../../../modules/files/entities/file.uuid.js'

export class CreateContactCommand {
  @ApiProperty({ type: String, nullable: true, example: 'John' })
  @IsNullable()
  @IsString()
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  @IsNullable()
  @IsString()
  lastName: string | null

  @ApiProperty({ type: String, format: 'email', nullable: true })
  @IsNullable()
  @IsEmail()
  email: string | null

  @ApiProperty({ type: String, format: 'phone', nullable: true, example: '+32473301974' })
  @IsNullable()
  @IsPhoneNumber()
  phone: string | null

  @ApiProperty({ type: AddressCommand, nullable: true })
  @IsNullable()
  @IsAddress()
  address: AddressCommand | null

  @ApiProperty({ type: 'string', nullable: true, format: 'uuid' })
  @IsNullable()
  @IsUUID()
  fileUuid: FileUuid | null

  @ApiProperty({ type: MonetaryDto, nullable: true })
  @IsNullable()
  @IsMonetary({
    allowedCurrencies: new Set([Currency.EUR]),
    maxPrecision: 4,
    minAmount: 0
  })
  discount: MonetaryDto | null

  @ApiProperty({ type: MonetaryDto, nullable: true })
  @IsNullable()
  @IsMonetary({ maxPrecision: 4 })
  balance: MonetaryDto | null

  @ApiProperty({ type: 'string', format: 'date' })
  @IsDateWithoutTimeString()
  @IsNullable()
  birthDate: string | null
}
