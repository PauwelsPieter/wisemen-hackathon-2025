import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SearchCollectionsUseCase } from './search-collections.use-case.js'
import { SearchCollectionsQuery } from './query/search-collections.query.js'
import { SearchCollectionsResponse } from './responses/search-collections.response.js'

@ApiTags('Global Search')
@Controller('search')
export class SearchCollectionsController {
  constructor (
    private readonly useCase: SearchCollectionsUseCase
  ) {}

  @Get()
  @ApiOkResponse({ type: SearchCollectionsResponse })
  async globalSearch (
    @Query() query: SearchCollectionsQuery
  ): Promise<SearchCollectionsResponse> {
    return await this.useCase.execute(query)
  }
}
