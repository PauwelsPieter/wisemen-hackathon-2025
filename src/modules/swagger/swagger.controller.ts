import { join } from 'path'
import { Controller, Get, Res } from '@nestjs/common'
import { ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Public } from '../permission/permission.decorator.js'

@ApiTags('Swagger')
@Controller({
  version: ''
})
@ApiOAuth2([])
export class SwaggerController {
  @Get('oauth2-redirect')
  @Public()
  handleRedirect (@Res() response: Response) {
    const filePath = join(process.cwd() + '/dist/src/modules/swagger/resources/oauth2-redirect.html')

    response.sendFile(filePath)
  }
}
