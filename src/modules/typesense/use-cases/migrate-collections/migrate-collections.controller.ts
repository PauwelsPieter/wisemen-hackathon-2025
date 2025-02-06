import { Controller, Get, Query } from '@nestjs/common'
import { ApiOAuth2, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'
import { MigrateCollectionsUseCase } from './migrate-collections.use-case.js'
import { MigrateTypesenseQuery } from './migrate-collections.query.js'

@ApiTags('Typesense')
@Controller('typesense')
@ApiOAuth2([])
export class MigrateCollectionsController {
  constructor (private readonly migrateCollectionsUseCase: MigrateCollectionsUseCase) {}

  @Get('migrate')
  @ApiQuery({ required: false, name: 'fresh', type: 'boolean' })
  @ApiQuery({ required: false, name: 'collections', enum: TypesenseCollectionName, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully migrated collections'
  })
  @Permissions(Permission.TYPESENSE)
  async migrate (
    @Query() query: MigrateTypesenseQuery
  ): Promise<void> {
    await this.migrateCollectionsUseCase.execute(query.fresh, query.collections)
  }
}
