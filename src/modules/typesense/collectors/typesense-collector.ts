export interface TypesenseCollector {
  transform: (entities: unknown[]) => object[]
  fetch: (uuids?: string[]) => Promise<unknown[]>
  fetchChanged: (since: Date) => Promise<unknown[]>
  fetchRemoved: (since: Date) => Promise<string[]>
}
