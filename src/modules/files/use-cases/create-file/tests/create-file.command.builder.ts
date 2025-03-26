import { MimeType } from '../../../enums/mime-type.enum.js'
import { CreateFileCommand } from '../create-file.command.js'

export class CreateFileCommandBuilder {
  private command: CreateFileCommand

  constructor () {
    this.reset()
  }

  reset (): this {
    this.command = new CreateFileCommand()

    this.command.name = 'test.png'
    this.command.mimeType = MimeType.PNG

    return this
  }

  withName (name: string): this {
    this.command.name = name

    return this
  }

  withMimeType (mimeType: MimeType): this {
    this.command.mimeType = mimeType

    return this
  }

  build (): CreateFileCommand {
    const result = this.command

    this.reset()

    return result
  }
}
