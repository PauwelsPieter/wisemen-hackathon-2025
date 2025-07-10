import { Controller, Get, Query } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { MigrateCollectionsUseCase } from './migrate-collections.use-case.js'
import { MigrateTypesenseQuery } from './migrate-collections.query.js'

@ApiTags('Typesense')
@Controller('typesense')
@ApiOAuth2([])
export class MigrateCollectionsController {
  constructor (private readonly migrateCollectionsUseCase: MigrateCollectionsUseCase) {}

  @Get('migrate')
  @ApiOkResponse()
  @Permissions(Permission.TYPESENSE)
  async migrate (
    @Query() query: MigrateTypesenseQuery
  ): Promise<void> {
    await this.migrateCollectionsUseCase.execute(query.fresh, query.collections)
  }
}
