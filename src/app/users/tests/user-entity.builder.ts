import { randomUUID } from 'node:crypto'
import { v4 } from 'uuid'
import { User } from '../entities/user.entity.js'

export class UserEntityBuilder {
  private user: User

  constructor () {
    this.reset()
  }

  reset (): this {
    this.user = new User()

    this.user.uuid = randomUUID()
    this.user.userId = v4()
    this.user.createdAt = new Date()
    this.user.updatedAt = new Date()
    this.user.email = 'test@mail.com'
    this.user.firstName = 'John'
    this.user.lastName = 'Doe'

    return this
  }

  withUuid (uuid: string): this {
    this.user.uuid = uuid

    return this
  }

  withEmail (email: string): this {
    this.user.email = email

    return this
  }

  withFirstName (firstName: string | null): this {
    this.user.firstName = firstName

    return this
  }

  withLastName (lastName: string | null): this {
    this.user.lastName = lastName

    return this
  }

  withId (id: string): this {
    this.user.userId = id

    return this
  }

  build (): User {
    const result = this.user

    this.reset()

    return result
  }
}
