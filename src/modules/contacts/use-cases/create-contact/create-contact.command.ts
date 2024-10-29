import { IsEmail, IsPhoneNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNullable } from '../../../../utils/validators/is-nullable.validator.js'

export class CreateContactCommand {
  @ApiProperty()
  @IsNullable()
  @IsString()
  firstName: string | null

  @ApiProperty()
  @IsNullable()
  @IsString()
  lastName: string | null

  @ApiProperty()
  @IsNullable()
  @IsEmail()
  email: string | null

  @ApiProperty()
  @IsNullable()
  @IsPhoneNumber()
  phone: string | null
}
