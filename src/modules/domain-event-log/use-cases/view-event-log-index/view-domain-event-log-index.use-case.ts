import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { DomainEventLog } from '../../domain-event-log.entity.js'
import { DEFAULT_LIMIT } from '../../../typesense/builder/search-params.builder.js'
import { ViewDomainEventLogIndexQuery } from './view-domain-event-log-index.query.js'
import { ViewDomainEventLogIndexResponse } from './view-domain-event-log-index.response.js'

@Injectable()
export class ViewDomainEventLogIndexUseCase {
  constructor (
    @InjectRepository(DomainEventLog) private readonly logRepository: Repository<DomainEventLog>
  ) {}

  async getLogs (query: ViewDomainEventLogIndexQuery): Promise<ViewDomainEventLogIndexResponse> {
    const queryBuilder = this.logRepository.createQueryBuilder('event_log')

    if (query.pagination?.key != null) {
      queryBuilder.where('(created_at, uuid) < (:createdAt, :uuid)', query.pagination.key)
    }

    const logs = await queryBuilder
      .orderBy('created_at', 'DESC')
      .addOrderBy('uuid', 'DESC')
      .limit(query.pagination?.limit ?? DEFAULT_LIMIT)
      .getMany()

    return new ViewDomainEventLogIndexResponse(logs)
  }
}
