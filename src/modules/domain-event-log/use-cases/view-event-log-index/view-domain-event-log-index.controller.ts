import { Controller, Get, Query } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { ViewDomainEventLogIndexUseCase } from './view-domain-event-log-index.use-case.js'
import { ViewDomainEventLogIndexResponse } from './view-domain-event-log-index.response.js'
import { ViewDomainEventLogIndexQuery } from './view-domain-event-log-index.query.js'

@ApiTags('Event logs')
@ApiOAuth2([])
@Controller('/event-logs')
export class ViewDomainEventLogIndexController {
  constructor (
    private readonly useCase: ViewDomainEventLogIndexUseCase
  ) {}

  @Get()
  @Permissions(Permission.EVENT_LOG_READ)
  @ApiOkResponse({ type: ViewDomainEventLogIndexResponse })
  async getLogs (
    @Query() query: ViewDomainEventLogIndexQuery
  ): Promise<ViewDomainEventLogIndexResponse> {
    return await this.useCase.getLogs(query)
  }
}
