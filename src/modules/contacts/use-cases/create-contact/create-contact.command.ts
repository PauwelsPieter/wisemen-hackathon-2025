import { IsEmail, IsPhoneNumber, IsString } from 'class-validator'
import { IsNullable } from '../../../../utils/validators/is-nullable.validator.js'

export class CreateContactCommand {
  @IsNullable()
  @IsString()
  firstName: string | null

  @IsNullable()
  @IsString()
  lastName: string | null

  @IsNullable()
  @IsEmail()
  email: string | null

  @IsNullable()
  @IsPhoneNumber()
  phone: string | null
}
