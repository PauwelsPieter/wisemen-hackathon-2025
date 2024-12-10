import { Injectable } from '@nestjs/common'
import type { User } from '../../entities/user.entity.js'
import { UserRepository } from '../../repositories/user.repository.js'

@Injectable()
export class ViewMeUseCase {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  async viewMe (userUuid: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      relations: { userRoles: { role: true } }
    })
  }
}
