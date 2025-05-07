import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { exhaustiveCheck } from '../../../../utils/helpers/exhaustive-check.helper.js'
import { TypesenseCollectionName } from '../../../typesense/collections/typesense-collection-name.enum.js'
import { GlobalSearchTypesenseCollectionNameApiProperty, GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseResult } from '../../global-search-typesense-collections.js'
import { TypesenseUser } from '../../../../app/users/typesense/typesense-user.js'
import { TypesenseContact } from '../../../../app/contact/typesense/typesense-contact.js'
import { SearchCollectionUserResponse } from './search-collection-user.response.js'
import { SearchCollectionContactResponse } from './search-collection-contact.response.js'

@ApiExtraModels(
  SearchCollectionUserResponse,
  SearchCollectionContactResponse
)
class SearchCollectionsResponseItem {
  @GlobalSearchTypesenseCollectionNameApiProperty()
  collection: GlobalSearchTypesenseCollectionNames

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SearchCollectionUserResponse) },
      { $ref: getSchemaPath(SearchCollectionContactResponse) }
    ]
  })
  entity: SearchCollectionUserResponse | SearchCollectionContactResponse

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
        return new SearchCollectionUserResponse(item as TypesenseUser)
      case TypesenseCollectionName.CONTACT:
        return new SearchCollectionContactResponse(item as TypesenseContact)
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
