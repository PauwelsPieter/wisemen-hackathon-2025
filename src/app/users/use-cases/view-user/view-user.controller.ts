import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { UserUuid } from '../../entities/user.uuid.js'
import { ViewUserUseCase } from './view-user.use-case.js'
import { ViewUserResponse } from './view-user.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:uuid')
export class ViewUserController {
  constructor (
    private readonly useCase: ViewUserUseCase
  ) {}

  @Get()
  @Permissions(Permission.USER_READ)
  @ApiOkResponse({
    description: 'User details retrieved',
    type: ViewUserResponse
  })
  async viewUser (
    @UuidParam('uuid') userUuid: UserUuid
  ): Promise<ViewUserResponse> {
    const user = await this.useCase.viewUser(userUuid)

    return new ViewUserResponse(user)
  }
}
