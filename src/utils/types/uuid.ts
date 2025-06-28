export type Uuid<Brand extends string> = string
  & { readonly __brand: unique symbol }
  & { readonly __uuid: Brand }

export function generateUuid<Brand extends Uuid<string>> (): Brand {
  return crypto.randomUUID() as Brand
}
