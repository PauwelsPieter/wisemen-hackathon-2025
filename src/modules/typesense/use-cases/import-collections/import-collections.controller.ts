import { Controller, Get, Query } from '@nestjs/common'
import { ApiOAuth2, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { ImportCollectionsUseCase } from './import-collections.use-case.js'
import { ImportTypesenseQuery } from './import-collections.query.js'

@ApiTags('Typesense')
@Controller('typesense')
@ApiOAuth2([])
export class ImportCollectionsController {
  constructor (private readonly useCase: ImportCollectionsUseCase) {}

  @Get('import')
  @ApiQuery({ required: false, name: 'collections', enum: TypesenseCollectionName, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully imported collections'
  })
  @Permissions(Permission.TYPESENSE)
  async import (
    @Query() query: ImportTypesenseQuery
  ): Promise<void> {
    await this.useCase.execute(query.collections)
  }
}
