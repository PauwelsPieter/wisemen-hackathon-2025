import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { exhaustiveCheck } from '../../../../utils/helpers/exhaustive-check.helper.js'
import { TypesenseCollectionName } from '../../../typesense/enums/typesense-collection-index.enum.js'
import { GlobalSearchTypesenseCollectionNameApiProperty, GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseResult } from '../../global-search-typesense-collections.js'
import { SearchCollectionUserResponse } from './search-collection-user.response.js'

@ApiExtraModels(
  SearchCollectionUserResponse
)
class SearchCollectionsResponseItem {
  @GlobalSearchTypesenseCollectionNameApiProperty()
  collection: GlobalSearchTypesenseCollectionNames

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SearchCollectionUserResponse) }
    ]
  })
  entity: SearchCollectionUserResponse

  @ApiProperty({ type: 'number' })
  text_match: number

  constructor (searchCollectionsItem: GlobalSearchTypesenseResult) {
    this.collection = searchCollectionsItem.collection
    this.entity = this.mapEntity(searchCollectionsItem)
    this.text_match = searchCollectionsItem.text_match
  }

  private mapEntity (
    searchCollectionsItem: GlobalSearchTypesenseResult
  ) {
    const item = searchCollectionsItem.item

    switch (searchCollectionsItem.collection) {
      case TypesenseCollectionName.USER:
        return new SearchCollectionUserResponse(item)
      default:
        exhaustiveCheck(searchCollectionsItem.collection)
    }
  }
}

export class SearchCollectionsResponse {
  @ApiProperty({ type: SearchCollectionsResponseItem, isArray: true })
  declare items: SearchCollectionsResponseItem[]

  constructor (
    searchCollectionsItems: GlobalSearchTypesenseResult[]
  ) {
    this.items = searchCollectionsItems.map((item) => {
      return new SearchCollectionsResponseItem(item)
    })
  }
}
