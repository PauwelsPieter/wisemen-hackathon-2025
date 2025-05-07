import { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'

const TYPESENSE_COLLECTOR_KEY = Symbol('wisemen.typesense-collector')
export function RegisterTypesenseCollector (collection: TypesenseCollectionName): ClassDecorator {
  return applyDecorators(
    Injectable(),
    ((target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(TYPESENSE_COLLECTOR_KEY, collection, target)
    }) as ClassDecorator
  )
}

export function isTypesenseCollector (collector: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(TYPESENSE_COLLECTOR_KEY, collector) !== undefined
}

export function getTypesenseCollectorCollection (
  collector: ClassConstructor<unknown>
): TypesenseCollectionName {
  const config = Reflect.getMetadata(TYPESENSE_COLLECTOR_KEY, collector) as unknown

  if (config === undefined) {
    throw new Error(`${collector.name} is not a valid typesense collector`
      + `\nDid you forget to add the @RegisterTypesenseCollector(...) decorator?`)
  }

  return config as TypesenseCollectionName
}
