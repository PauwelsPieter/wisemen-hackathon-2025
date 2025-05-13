import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { ViewUserIndexQuery } from './view-user-index.query.js'
import { ViewUserIndexUseCase } from './view-user-index.use-case.js'
import { ViewUserIndexResponse } from './view-user-index.response.js'

@ApiTags('User')
@ApiOAuth2([])
@Controller('users')
export class ViewUserIndexController {
  constructor (
    private readonly useCase: ViewUserIndexUseCase
  ) {}

  @Get()
  @Permissions(Permission.USER_READ)
  @ApiOkResponse({
    description: 'Users retrieved',
    type: ViewUserIndexResponse
  })
  async viewUsers (
    @Query() query: ViewUserIndexQuery
  ): Promise<ViewUserIndexResponse> {
    return await this.useCase.viewUsers(query)
  }
}
