import { before, describe, it } from 'node:test'
import { randomUUID } from 'crypto'
import { assert, createStubInstance } from 'sinon'
import { InsertResult, Repository } from 'typeorm'
import { expect } from 'expect'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { CreateContactCommandBuilder } from '../create-contact.command.builder.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { Contact } from '../../../entities/contact.entity.js'
import { CreateContactUseCase } from '../create-contact.use-case.js'
import { ContactEntityBuilder } from '../../../entities/contact.entity.builder.js'
import { ContactCreatedEvent } from '../contact-created.event.js'

describe('CreateContactUseCase Unit test', () => {
  before(() => {
    TestBench.setupUnitTest()
  })

  it('the use cases calls the repository once', async () => {
    const eventEmitter = createStubInstance(DomainEventEmitter)

    const contactRepo = createStubInstance(Repository<Contact>)
    contactRepo.insert.callsFake((contact: Contact) => {
      contact.uuid = randomUUID()
      return Promise.resolve({} as InsertResult)
    })

    const useCase = new CreateContactUseCase(
      stubDataSource(),
      eventEmitter,
      contactRepo
    )
    const command = new CreateContactCommandBuilder().build()

    await useCase.execute(command)

    assert.calledOnce(contactRepo.insert)
  })

  it('the use cases emits a contact created event', async () => {
    const eventEmitter = createStubInstance(DomainEventEmitter)

    const contactRepo = createStubInstance(Repository<Contact>)

    const useCase = new CreateContactUseCase(
      stubDataSource(),
      eventEmitter,
      contactRepo
    )
    const command = new CreateContactCommandBuilder().build()

    const { uuid: contactUuid } = await useCase.execute(command)

    const expectedContact = new ContactEntityBuilder()
      .withUuid(contactUuid)
      .withFirstName(command.firstName)
      .withLastName(command.lastName)
      .withEmail(command.email)
      .withPhone(command.phone)
      .withAddress(command.address?.parse() ?? null)
      .build()

    expect(eventEmitter).toHaveEmitted(new ContactCreatedEvent(expectedContact))
  })
})
