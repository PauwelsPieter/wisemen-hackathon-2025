import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { UserIsSelfOrAdminGuard } from '../../guards/user-is-self-or-admin.guard.js'
import { ViewUserUseCase } from './view-user.use-case.js'
import { ViewUserResponse } from './view-user.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users/:user')
export class ViewUserController {
  constructor (
    private readonly useCase: ViewUserUseCase
  ) {}

  @Get()
  @UseGuards(UserIsSelfOrAdminGuard)
  @Permissions(Permission.USER_READ)
  @ApiOkResponse({
    description: 'User details retrieved',
    type: ViewUserResponse
  })
  async viewUser (
    @Param('user') userId: string
  ): Promise<ViewUserResponse> {
    const user = await this.useCase.viewUser(userId)

    return new ViewUserResponse(user)
  }
}
