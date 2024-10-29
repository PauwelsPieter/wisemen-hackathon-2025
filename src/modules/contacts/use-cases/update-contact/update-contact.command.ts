import { IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CreateContactCommand } from '../create-contact/create-contact.command.js'

export class UpdateContactCommand extends CreateContactCommand {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isActive: boolean
}
