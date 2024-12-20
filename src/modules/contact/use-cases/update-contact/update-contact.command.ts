import { IsBoolean, IsEmail, IsPhoneNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNullable } from '@wisemen/validators'

export class UpdateContactCommand {
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

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isActive: boolean
}
