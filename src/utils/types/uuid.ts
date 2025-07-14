export type Uuid<Brand extends string> = string
  & { readonly __brand: unique symbol }
  & { readonly __uuid: Brand }

export function generateUuid<Brand extends Uuid<string> | null> (): Exclude<Brand, null> {
  return crypto.randomUUID() as Exclude<Brand, null>
}
