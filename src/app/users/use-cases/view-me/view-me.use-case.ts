import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity.js'
import { UserUuid } from '../../entities/user.uuid.js'

@Injectable()
export class ViewMeUseCase {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async viewMe (uuid: UserUuid): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { uuid },
      relations: { userRoles: { role: true } }
    })
  }
}
