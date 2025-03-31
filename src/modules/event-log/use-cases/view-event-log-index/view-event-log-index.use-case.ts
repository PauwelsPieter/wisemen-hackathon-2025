import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { EventLog } from '../../event-log.entity.js'
import { DEFAULT_LIMIT } from '../../../typesense/builder/search-params.builder.js'
import { ViewEventLogIndexQuery } from './view-event-log-index.query.js'
import { ViewEventLogIndexResponse } from './view-event-log-index.response.js'

@Injectable()
export class ViewEventLogIndexUseCase {
  constructor (
    @InjectRepository(EventLog) private readonly logRepository: Repository<EventLog>
  ) {}

  async getLogs (query: ViewEventLogIndexQuery): Promise<ViewEventLogIndexResponse> {
    const queryBuilder = this.logRepository.createQueryBuilder('event_log')

    if (query.pagination?.key != null) {
      queryBuilder.where('(created_at, uuid) < (:createdAt, :uuid)', query.pagination.key)
    }

    const logs = await queryBuilder
      .orderBy('created_at', 'DESC')
      .addOrderBy('uuid', 'DESC')
      .limit(query.pagination?.limit ?? DEFAULT_LIMIT)
      .getMany()

    return new ViewEventLogIndexResponse(logs)
  }
}
