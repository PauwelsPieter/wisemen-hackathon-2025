import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { UserUuid } from '../../entities/user.uuid.js'
import { UserNotFoundError } from '../../errors/user-not-found.error.js'

@Injectable()
export class ViewUserDetailUseCase {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async viewUser (withUuid: UserUuid): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid: withUuid },
      relations: { userRoles: { role: true } }
    })

    if (user === null) {
      throw new UserNotFoundError(withUuid)
    }

    return user
  }
}
