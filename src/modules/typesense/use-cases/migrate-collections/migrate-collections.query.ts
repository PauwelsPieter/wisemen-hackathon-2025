import {
  IsBoolean,
  IsEnum,
  IsOptional
} from 'class-validator'
import { Transform } from 'class-transformer'
import { toBoolean } from '../../../../utils/transformers/to-boolean.js'
import { TypesenseCollectionName } from '../../collections/typesense-collection-name.enum.js'

export class MigrateTypesenseQuery {
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  fresh: boolean

  @IsOptional()
  @IsEnum(TypesenseCollectionName, { each: true })
  collections: TypesenseCollectionName[] = Object.values(TypesenseCollectionName)
}
