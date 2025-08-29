import { Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { Public } from '../../../permission/permission.decorator.js'
import { CreateNaturalLanguageSearchModelUseCase } from './create-nl-search-model.use-case.js'

@ApiTags('Typesense')
@Controller('typesense/create-nl-search-model')
@Public()
export class CreateNaturalLanguageSearchModelController {
  constructor (
    private readonly useCase: CreateNaturalLanguageSearchModelUseCase
  ) {}

  @Post()
  @ApiOkResponse()
  async execute (): Promise<void> {
    await this.useCase.execute()
  }
}
