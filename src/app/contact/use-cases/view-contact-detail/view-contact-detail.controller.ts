import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { ViewContactDetailUseCase } from './view-contact-detail.use-case.js'
import { ViewContactDetailResponse } from './view-contact-detail.response.js'

@ApiTags('Contact')
@ApiOAuth2([])
@Controller('contacts/:uuid')
export class ViewContactDetailController {
  constructor (
    private readonly viewContactDetailUseCase: ViewContactDetailUseCase
  ) { }

  @Get()
  @Permissions(Permission.CONTACT_READ)
  @ApiOkResponse({ type: ViewContactDetailResponse })
  public async viewContactDetail (
    @UuidParam('uuid') uuid: string
  ): Promise<ViewContactDetailResponse> {
    return this.viewContactDetailUseCase.execute(uuid)
  }
}
