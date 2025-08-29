import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiOAuth2 } from '@nestjs/swagger'
import { Permissions, Public } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { ViewNaturalLanguageModelIndex } from './view-nl-search-model-index.response.js'
import { ViewNaturalLanguageModelIndexUseCase } from './view-nl-search-model-index.use-case.js'

@ApiTags('Typesense')
@Controller('typesense/nl-search-models')
@ApiOAuth2([])
@Public()
export class ViewNaturalLanguageModelIndexController {
  constructor (
    private readonly useCase: ViewNaturalLanguageModelIndexUseCase
  ) {}

  @Get()
  @Permissions(Permission.TYPESENSE)
  @ApiOkResponse({ type: ViewNaturalLanguageModelIndex })
  async execute (): Promise<ViewNaturalLanguageModelIndex> {
    return this.useCase.execute()
  }
}
