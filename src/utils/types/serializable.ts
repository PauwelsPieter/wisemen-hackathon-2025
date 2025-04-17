export type Primitive = string | number | boolean | null
export type Serializable = {
  [key: string | number | symbol]: Serializable | Serializable[] | Primitive | Primitive[]
}
