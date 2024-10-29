import { IsBoolean } from 'class-validator'
import { CreateContactCommand } from '../create-contact/create-contact.command.js'

export class UpdateContactCommand extends CreateContactCommand {
  @IsBoolean()
  isActive: boolean
}
