import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { User } from '../../entities/user.entity.js'

@Injectable()
export class ViewUserUseCase {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async viewUser (userUuid: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
      relations: { userRoles: { role: true } }
    })
  }
}
