import { Controller, Get, Query } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { ViewEventLogIndexUseCase } from './view-event-log-index.use-case.js'
import { ViewEventLogIndexResponse } from './view-event-log-index.response.js'
import { ViewEventLogIndexQuery } from './view-event-log-index.query.js'

@ApiTags('Event logs')
@ApiOAuth2([])
@Controller('/event-logs')
export class ViewEventLogIndexController {
  constructor (
    private readonly useCase: ViewEventLogIndexUseCase
  ) {}

  @Get()
  @Permissions(Permission.EVENT_LOG_READ)
  @ApiOkResponse({ type: ViewEventLogIndexResponse })
  async getLogs (
    @Query() query: ViewEventLogIndexQuery
  ): Promise<ViewEventLogIndexResponse> {
    return await this.useCase.getLogs(query)
  }
}
