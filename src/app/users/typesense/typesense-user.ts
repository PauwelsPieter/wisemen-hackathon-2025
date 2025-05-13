import type { User } from '../entities/user.entity.js'
import { UserUuid } from '../entities/user.uuid.js'

export class TypesenseUser {
  id: UserUuid
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
