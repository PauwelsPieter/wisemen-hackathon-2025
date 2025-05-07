import {
  IsEnum,
  IsOptional
} from 'class-validator'
import { TypesenseCollectionName } from '../../collections/typesense-collection-name.enum.js'

export class ImportTypesenseQuery {
  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
