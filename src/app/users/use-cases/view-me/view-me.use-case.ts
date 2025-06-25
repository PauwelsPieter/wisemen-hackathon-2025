import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity.js'
import { UserUuid } from '../../entities/user.uuid.js'
import { UserNotFoundError } from '../../errors/user-not-found.error.js'

@Injectable()
export class ViewMeUseCase {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async viewMe (uuid: UserUuid): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: { userRoles: { role: true } }
    })

    if (user === null) {
      throw new UserNotFoundError(uuid)
    }

    return user
  }
}
