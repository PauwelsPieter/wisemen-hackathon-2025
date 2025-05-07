export abstract class CronjobUseCase {
  abstract execute (): void | Promise<void>
}
