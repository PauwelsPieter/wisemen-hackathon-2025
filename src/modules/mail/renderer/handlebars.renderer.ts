import fs from 'fs/promises'
import hbs from 'handlebars'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HandlebarsRenderer {
  private readonly moduleDir = process.cwd() + '/dist/src/modules/'

  public async render (
    hbsFilePath: string,
    data?: Record<string, unknown>
  ): Promise<string> {
    const template = await fs.readFile(this.moduleDir + hbsFilePath, 'utf-8')
    const renderTemplate = hbs.compile(template)
    const html = renderTemplate(data)

    return html
  }
}
