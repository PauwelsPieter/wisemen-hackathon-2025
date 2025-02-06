import { Controller, Get } from '@nestjs/common'
import type { CollectionSchema } from 'typesense/lib/Typesense/Collection.js'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { ViewCollectionsUseCase } from './view-collections.use-case.js'

@ApiTags('Typesense')
@Controller('typesense')
@ApiOAuth2([])
export class ViewCollectionsController {
  constructor (private readonly viewCollectionsUseCase: ViewCollectionsUseCase) {}

  @Get('collections')
  @ApiResponse({
    status: 200,
    description: 'Successfully returned collections'
  })
  @Permissions(Permission.TYPESENSE)
  async getCollections (): Promise<CollectionSchema[]> {
    return await this.viewCollectionsUseCase.execute()
  }
}
