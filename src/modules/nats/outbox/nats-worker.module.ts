import { type DynamicModule, Module } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'
import { PgBossModule } from '../../pgboss/pgboss.module.js'
import { DefaultTypeOrmModule } from '../../typeorm/default-typeorm.module.js'
import { DefaultConfigModule } from '../../config/default-config.module.js'
import { PublishNatsEventJob } from './publish-nats-event.job.js'

@Module({})
export class NatsWorkerModule {
  static forRoot (
    modules: DynamicModule[]
  ): DynamicModule {
    return {
      module: NatsWorkerModule,
      imports: [
        PgBossModule.forFeature([PublishNatsEventJob]),
        DefaultTypeOrmModule.forRootAsync(),
        DefaultConfigModule.forRoot(),
        ...modules
      ],
      providers: [
        NatsClient
      ]
    }
  }
}
