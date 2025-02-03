import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { ViewContactIndexQuery } from './view-contact-index.query.js'
import { ViewContactIndexResponse } from './view-contact-index.response.js'
import { ViewContactIndexUseCase } from './view-contact-index.use-case.js'

@ApiTags('Contact')
@ApiOAuth2([])
@Controller('contacts')
export class ViewContactIndexController {
  constructor (
    private readonly viewContactIndexUseCase: ViewContactIndexUseCase
  ) { }

  @Get()
  @Permissions(Permission.CONTACT_READ)
  @ApiOkResponse({ type: ViewContactIndexResponse })
  public async viewContactIndex (
    @Query() query: ViewContactIndexQuery
  ): Promise<ViewContactIndexResponse> {
    return this.viewContactIndexUseCase.execute(query)
  }
}
