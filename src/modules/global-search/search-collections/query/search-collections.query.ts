import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { Equals, ValidateNested, IsNotEmpty, IsString, IsEnum, IsArray, IsOptional, IsObject, IsBooleanString } from 'class-validator'
import { FilterQuery } from '@wisemen/pagination'
import { IsUndefinable } from '@wisemen/validators'
import { GlobalSearchTypesenseCollectionNameApiProperty, GlobalSearchTypesenseCollectionNames, GlobalSearchTypesenseCollections } from '../../global-search-typesense-collections.js'

export class SearchCollectionsFilterContactQuery extends FilterQuery {
  @ApiProperty({ type: 'boolean', required: false })
  @IsUndefinable()
  @IsBooleanString()
  isActive?: string
}

export class SearchCollectionsFilterQuery extends FilterQuery {
  @GlobalSearchTypesenseCollectionNameApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsEnum(GlobalSearchTypesenseCollections, { each: true })
  @IsArray()
  collections?: GlobalSearchTypesenseCollectionNames[]

  @ApiProperty({ type: SearchCollectionsFilterContactQuery, required: false })
  @IsObject()
  @IsOptional()
  @Type(() => SearchCollectionsFilterContactQuery)
  @ValidateNested()
  contact?: SearchCollectionsFilterContactQuery
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
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  search?: string

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  prompt: string

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  model: string
}
