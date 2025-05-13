import { Injectable } from '@nestjs/common'
import { ViewUserIndexRepsitory } from './view-user-index.repository.js'
import type { ViewUserIndexQuery } from './view-user-index.query.js'
import { ViewUserIndexResponse } from './view-user-index.response.js'

@Injectable()
export class ViewUserIndexUseCase {
  constructor (
    private readonly repository: ViewUserIndexRepsitory
  ) {}

  async viewUsers (query: ViewUserIndexQuery): Promise<ViewUserIndexResponse> {
    const users = await this.repository.searchUsers(query)
    const userUuids = users.items.map(user => user.id)
    const userRoles = await this.repository.fetchUserRoles(userUuids)

    return new ViewUserIndexResponse(users, userRoles)
  }
}
