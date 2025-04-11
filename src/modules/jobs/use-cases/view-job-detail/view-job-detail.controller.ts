import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { toBoolean } from '../../../../utils/transformers/to-boolean.js'
import { ViewJobDetailResponse } from './view-job-detail.response.js'
import { ViewJobDetailQuery } from './view-job-detail.query.js'
import { ViewJobDetailUseCase } from './view-job-detail.use-case.js'

@Controller('/jobs/:jobId')
@ApiTags('Jobs')
@ApiOAuth2([])
export class ViewJobDetailController {
  constructor (
    private readonly useCase: ViewJobDetailUseCase
  ) {}

  @Get()
  @Permissions(Permission.JOBS_READ_DETAIL)
  @ApiOkResponse({ type: ViewJobDetailResponse })
  async getJob (
    @UuidParam('jobId') jobId: string,
    @Query() query: ViewJobDetailQuery
  ): Promise<ViewJobDetailResponse> {
    const isArchived = toBoolean(query.isArchived ?? false)
    return await this.useCase.execute(jobId, isArchived)
  }
}
