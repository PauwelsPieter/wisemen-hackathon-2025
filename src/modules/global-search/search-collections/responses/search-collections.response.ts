import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { exhaustiveCheck } from '../../../../utils/helpers/exhaustive-check.helper.js'
import { TypesenseCollectionName } from '../../../typesense/collections/typesense-collection-name.enum.js'
import { GlobalSearchTypesenseCollectionNameApiProperty, GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseResult } from '../../global-search-typesense-collections.js'
import { TypesenseGse } from '../../../../app/gse/typesense/typesense-gse.js'
import { TypesensePlanning } from '../../../../app/planning/typesense/typesense-planning.js'
import { TypesenseAirport } from '../../../../app/airport/typesense/typesense-airport.js'
import { SearchCollectionGseResponse } from './search-collection.gse.response.js'
import { SearchCollectionPlanningResponse } from './search-collection-planning.response.js'
import { SearchCollectionAirportResponse } from './search-collection-airport.response.js'

@ApiExtraModels(
  SearchCollectionGseResponse,
  SearchCollectionPlanningResponse,
  SearchCollectionAirportResponse
)
class SearchCollectionsResponseItem {
  @GlobalSearchTypesenseCollectionNameApiProperty()
  collection: GlobalSearchTypesenseCollectionNames

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SearchCollectionGseResponse) },
      { $ref: getSchemaPath(SearchCollectionPlanningResponse) },
      { $ref: getSchemaPath(SearchCollectionAirportResponse) }
    ]
  })
  entity: SearchCollectionGseResponse
    | SearchCollectionPlanningResponse
    | SearchCollectionAirportResponse

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
      case TypesenseCollectionName.GSE:
        return new SearchCollectionGseResponse(item as TypesenseGse)
      case TypesenseCollectionName.PLANNING:
        return new SearchCollectionPlanningResponse(item as TypesensePlanning)
      case TypesenseCollectionName.AIRPORT:
        return new SearchCollectionAirportResponse(item as TypesenseAirport)
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
