import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { ViewJobsIndexResponse } from './view-jobs-index.response.js'
import { ViewJobsIndexUseCase } from './view-jobs-index.use-case.js'
import { ViewJobsIndexQuery } from './query/view-jobs-index.query.js'

@Controller('jobs')
@ApiTags('Jobs')
@ApiOAuth2([])
export class ViewJobsIndexController {
  constructor (
    private readonly useCase: ViewJobsIndexUseCase
  ) {}

  @Get()
  @Permissions(Permission.JOBS_READ_INDEX)
  @ApiOkResponse({ type: ViewJobsIndexResponse })
  async getJobs (
    @Query() query: ViewJobsIndexQuery
  ): Promise<ViewJobsIndexResponse> {
    return await this.useCase.execute(query)
  }
}
