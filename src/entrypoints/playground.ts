import '../modules/exceptions/sentry.js'

import { INestApplicationContext, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import { SentryModule } from '@sentry/nestjs/setup'
import { Trace } from '@wisemen/opentelemetry'
import { DataSource } from 'typeorm'
import { ExceptionModule } from '../modules/exceptions/exception.module.js'
import { DefaultConfigModule } from '../modules/config/default-config.module.js'
import { DefaultTypeOrmModule } from '../modules/typeorm/default-typeorm.module.js'
import { Airport } from '../app/airport/entities/airport.entity.js'
import { Gse } from '../app/gse/entities/gse.entity.js'
import { GseType } from '../app/gse/enums/gse-type.enum.js'
import { Planning } from '../app/planning/entities/planning.entity.js'

@Module({
  imports: [
    SentryModule.forRoot(),
    DefaultConfigModule,
    DefaultTypeOrmModule.forRootAsync({ migrationsRun: false }),
    ExceptionModule
  ]
})
class PlayGroundModule {

}

export class Playground extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(PlayGroundModule)
  }

  @Trace()
  async execute (_app: INestApplicationContext): Promise<void> {
    const test = _app.get(DataSource)

    const airportRepo = test.getRepository(Airport)
    const gseRepo = test.getRepository(Gse)
    const planningRepo = test.getRepository(Planning)
    const airports = await airportRepo.save([
      { name: 'Los Angeles Intl', code: 'LAX' },
      { name: 'John F. Kennedy Intl', code: 'JFK' }
    ])

    // 2. Create 20 GSEs
    const gseList: Gse[] = []
    for (let i = 0; i < 20; i++) {
      const airport = airports[i % airports.length] // alternate airports
      const gse = gseRepo.create({
        airportUuid: airport.uuid,
        airport,
        type: Object.values(GseType)[i % Object.values(GseType).length], // cycle through enum
        soc: Math.floor(Math.random() * 100),
        temperatureCelsius: Math.floor(Math.random() * 35),
        location: {
          type: 'Point',
          coordinates: [
            -118.4085 + Math.random() * 0.01, // longitude jitter
            33.9416 + Math.random() * 0.01 // latitude jitter
          ]
        }
      })
      gseList.push(gse)
    }
    await gseRepo.save(gseList)

    // 3. Create plannings for each GSE (2 each for demo)
    const plannings: Planning[] = []
    for (const gse of gseList) {
      for (let j = 0; j < 2; j++) {
        const start = new Date()
        start.setHours(start.getHours() + j * 3)
        const end = new Date(start)
        end.setHours(end.getHours() + 2)

        plannings.push(
          planningRepo.create({
            gseUuid: gse.uuid,
            gse,
            from: start,
            to: end
          })
        )
      }
    }
    await planningRepo.save(plannings)
  }
}

const _playground = new Playground()
