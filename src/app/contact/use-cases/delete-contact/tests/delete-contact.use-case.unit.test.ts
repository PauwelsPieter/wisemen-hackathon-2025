import { before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { Repository } from 'typeorm'
import { ContactNotFoundError } from '../../../errors/contact.not-found.error.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { Contact } from '../../../entities/contact.entity.js'
import { DeleteContactUseCase } from '../delete-contact.use-case.js'
import { ContactDeletedEvent } from '../contact-deleted.event.js'

describe('DeleteContactUseCase Unit test', () => {
  before(() => {
    TestBench.setupUnitTest()
  })

  it('throws an error when the contact does not exist', async () => {
    const contactRepo = createStubInstance(Repository<Contact>)
    contactRepo.existsBy.resolves(false)

    const useCase = new DeleteContactUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      contactRepo
    )

    const contactUuid = randomUUID()

    await expect(useCase.execute(contactUuid))
      .rejects.toThrow(new ContactNotFoundError(contactUuid))
  })

  it('emits a contact deleted event', async () => {
    const contactRepo = createStubInstance(Repository<Contact>)
    contactRepo.existsBy.resolves(true)

    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new DeleteContactUseCase(
      stubDataSource(),
      eventEmitter,
      contactRepo
    )

    const contactUuid = randomUUID()

    await useCase.execute(contactUuid)

    expect(eventEmitter).toHaveEmitted(new ContactDeletedEvent(contactUuid))
  })
})
