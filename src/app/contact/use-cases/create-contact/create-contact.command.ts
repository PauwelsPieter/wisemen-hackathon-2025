import { IsEmail, IsPhoneNumber, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNullable } from '@wisemen/validators'
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
}
