import { ApiProperty } from '@nestjs/swagger'
import dayjs from 'dayjs'
import { PlanningUuid } from '../../../../app/planning/entities/planning.uuid.js'
import { TypesensePlanning } from '../../../../app/planning/typesense/typesense-planning.js'

export class SearchCollectionPlanningResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: PlanningUuid

  @ApiProperty({ type: String, format: 'date-time' })
  from: string

  @ApiProperty({ type: String, format: 'date-time' })
  to: string

  constructor (planning: TypesensePlanning) {
    this.uuid = planning.id
    this.from = dayjs.unix(planning.from).toISOString()
    this.to = dayjs.unix(planning.to).toISOString()
  }
}
