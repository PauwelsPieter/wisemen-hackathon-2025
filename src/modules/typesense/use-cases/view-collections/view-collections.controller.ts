import { Controller, Get } from '@nestjs/common'
import type { CollectionSchema } from 'typesense/lib/Typesense/Collection.js'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { ViewCollectionsUseCase } from './view-collections.use-case.js'

@ApiTags('Typesense')
@Controller('typesense')
@ApiOAuth2([])
export class ViewCollectionsController {
  constructor (private readonly viewCollectionsUseCase: ViewCollectionsUseCase) {}

  @Get('collections')
  @ApiOkResponse()
  @Permissions(Permission.TYPESENSE)
  async getCollections (): Promise<CollectionSchema[]> {
    return await this.viewCollectionsUseCase.execute()
  }
}
