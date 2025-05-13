import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'
import { UserUuid } from '../../entities/user.uuid.js'

@Injectable()
export class ViewUserDetailUseCase {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async viewUser (withUuid: UserUuid): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { uuid: withUuid },
      relations: { userRoles: { role: true } }
    })
  }
}
