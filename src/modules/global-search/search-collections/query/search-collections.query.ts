import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { Equals, ValidateNested, IsNotEmpty, IsString, IsEnum, IsArray, IsOptional, IsObject } from 'class-validator'
import { FilterQuery } from '@wisemen/pagination'
import { GlobalSearchTypesenseCollectionNameApiProperty, GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseCollections } from '../../global-search-typesense-collections.js'

export class SearchCollectionsFilterQuery extends FilterQuery {
  @GlobalSearchTypesenseCollectionNameApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsEnum(GlobalSearchTypesenseCollections, { each: true })
  @IsArray()
  collections?: GlobalSearchTypesenseCollectionNames[]
}

export class SearchCollectionsQuery {
  @Equals(undefined)
  sort?: never

  @ApiProperty({ type: SearchCollectionsFilterQuery })
  @Type(() => SearchCollectionsFilterQuery)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  filter?: SearchCollectionsFilterQuery

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  search: string
}
