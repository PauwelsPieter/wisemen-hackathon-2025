import { Injectable } from '@nestjs/common'
import { TypesenseQueryService } from '../../../../modules/typesense/services/typesense-query.service.js'
import { TypesenseSearchParamsBuilder } from '../../../../modules/typesense/builder/search-params.builder.js'
import { TypesenseCollectionName } from '../../../../modules/typesense/enums/typesense-collection-index.enum.js'
import { ContactTypesenseCollection } from '../../typesense/contact.typesense-collection.js'
import { ViewContactIndexResponse } from './view-contact-index.response.js'
import { ViewContactIndexQuery } from './query/view-contact-index.query.js'

@Injectable()
export class ViewContactIndexUseCase {
  constructor (
    private readonly typesense: TypesenseQueryService
  ) { }

  public async execute (
    query: ViewContactIndexQuery
  ): Promise<ViewContactIndexResponse> {
    const searchParamsBuilder = new TypesenseSearchParamsBuilder<ContactTypesenseCollection>()
      .withQuery(query.search)
      .withLimit(query.pagination?.limit)
      .withOffset(query.pagination?.offset)

    if (query.filter?.isActive != null) {
      searchParamsBuilder.addFilterOn('isActive', [query.filter.isActive])
    }

    if (query.search != null) {
      searchParamsBuilder.addSearchOn(['name', 'email', 'phone', 'city', 'country', 'postalCode', 'streetName', 'streetNumber', 'unit'])
    }

    const searchParams = searchParamsBuilder.build()

    const searchResult = await this.typesense.search(
      TypesenseCollectionName.CONTACT,
      searchParams
    )

    return new ViewContactIndexResponse(searchResult)
  }
}
