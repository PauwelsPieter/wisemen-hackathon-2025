import type { User } from '../entities/user.entity.js'

export class TypesenseUser {
  id: string
  firstName: string
  lastName: string
  email: string

  constructor (user: User) {
    return {
      id: user.uuid,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email
    }
  }
}
