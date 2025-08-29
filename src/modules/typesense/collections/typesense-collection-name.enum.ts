import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'

export enum TypesenseCollectionName {
  AIRPORT = 'airport',
  GSE = 'gse',
  PLANNING = 'planning',
  USER = 'user',
  CONTACT = 'contact'
}

export function TypesenseCollectionNameApiProperty (
  options?: ApiPropertyOptions
): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: TypesenseCollectionName,
    enumName: 'TypesenseCollectionName'
  })
}
