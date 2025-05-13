import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { TypesenseModule } from '../../../../modules/typesense/typesense.module.js'
import { UserRole } from '../../../roles/entities/user-role.entity.js'
import { ViewUserIndexRepsitory } from './view-user-index.repository.js'
import { ViewUserIndexController } from './view-user-index.controller.js'
import { ViewUserIndexUseCase } from './view-user-index.use-case.js'

@Module({
  imports: [
    TypesenseModule,
    TypeOrmModule.forFeature([UserRole])
  ],
  controllers: [ViewUserIndexController],
  providers: [ViewUserIndexUseCase, ViewUserIndexRepsitory]
})
export class ViewUserIndexModule {}
