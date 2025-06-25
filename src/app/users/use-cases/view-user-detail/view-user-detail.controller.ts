import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { UserUuid } from '../../entities/user.uuid.js'
import { ApiNotFoundErrorResponse } from '../../../../modules/exceptions/api-errors/api-error-response.decorator.js'
import { UserNotFoundError } from '../../errors/user-not-found.error.js'
import { ViewUserDetailUseCase } from './view-user-detail.use-case.js'
import { ViewUserDetailResponse } from './view-user-detail.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:uuid')
export class ViewUserDetailController {
  constructor (
    private readonly useCase: ViewUserDetailUseCase
  ) {}

  @Get()
  @Permissions(Permission.USER_READ)
  @ApiOkResponse({
    description: 'User details retrieved',
    type: ViewUserDetailResponse
  })
  @ApiNotFoundErrorResponse(UserNotFoundError)
  async viewUser (
    @UuidParam('uuid') userUuid: UserUuid
  ): Promise<ViewUserDetailResponse> {
    const user = await this.useCase.viewUser(userUuid)

    return new ViewUserDetailResponse(user)
  }
}
