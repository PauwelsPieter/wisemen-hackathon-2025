import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'
import { Planning } from '../entities/planning.entity.js'
import { PlanningTypesenseCollector } from './planning-typesense.collector.js'
import { PlanningTypesenseCollection } from './planning.collections.js'

@Module({
  imports: [TypeOrmModule.forFeature([Planning])],
  providers: [
    PlanningTypesenseCollector,
    PlanningTypesenseCollection
  ]
})
export class TypesensePlanningModule {}
