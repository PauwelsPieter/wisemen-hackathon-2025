export abstract class AbstractUseCase {
  abstract execute (): void | Promise<void>
}
