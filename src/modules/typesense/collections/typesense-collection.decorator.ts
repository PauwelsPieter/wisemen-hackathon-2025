import { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'
import { TypesenseCollectionName } from '../collections/typesense-collection-name.enum.js'

const TYPESENSE_COLLECTION_KEY = Symbol('wisemen.typesense-collection')
export function RegisterTypesenseCollection (collection: TypesenseCollectionName): ClassDecorator {
  return applyDecorators(
    Injectable(),
    ((target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(TYPESENSE_COLLECTION_KEY, collection, target)
    }) as ClassDecorator
  )
}

export function isTypesenseCollection (collection: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(TYPESENSE_COLLECTION_KEY, collection) !== undefined
}

export function getTypesenseCollectionCollectionName (
  collection: ClassConstructor<unknown>
): TypesenseCollectionName {
  const config = Reflect.getMetadata(TYPESENSE_COLLECTION_KEY, collection) as unknown

  if (config === undefined) {
    throw new Error(`${collection.name} is not a valid typesense collection`
      + `\nDid you forget to add the @RegisterTypesenseCollection(...) decorator?`)
  }

  return config as TypesenseCollectionName
}
