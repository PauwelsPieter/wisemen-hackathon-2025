import dayjs from 'dayjs'
import { Planning } from '../entities/planning.entity.js'
import { PlanningUuid } from '../entities/planning.uuid.js'

export class TypesensePlanning {
  id: PlanningUuid
  from: number
  to: number

  constructor (planning: Planning) {
    this.id = planning.uuid
    this.from = dayjs(planning.from).unix()
    this.to = dayjs(planning.to).unix()
  }
}
