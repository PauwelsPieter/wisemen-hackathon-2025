export class Optional<Type> {
  constructor (private readonly value?: Type) {}

  orUndefined (): Type | undefined {
    return this.value
  }

  orThrow (message?: string): Type {
    if (this.value === undefined) {
      throw new Error(message)
    } else {
      return this.value
    }
  }
}
