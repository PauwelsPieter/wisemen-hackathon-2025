import { randomUUID } from 'node:crypto'
import { User } from '../entities/user.entity.js'
import { UserUuid } from '../entities/user.uuid.js'
import { generateUuid } from '../../../utils/types/uuid.js'

export class UserEntityBuilder {
  private user: User

  constructor () {
    this.user = new User()
    this.user.uuid = generateUuid()
    this.user.userId = randomUUID()
    this.user.createdAt = new Date()
    this.user.updatedAt = new Date()
    this.user.email = `${randomUUID()}@mail.com`
    this.user.firstName = 'John'
    this.user.lastName = 'Doe'
  }

  withUuid (uuid: UserUuid): this {
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
    return this.user
  }
}
