import { before, describe, it } from 'node:test'
import { assert, createStubInstance } from 'sinon'
import { expect } from 'expect'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { CreateContactCommandBuilder } from '../create-contact.command.builder.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { CreateContactUseCase } from '../create-contact.use-case.js'
import { ContactEntityBuilder } from '../../../entities/contact.entity.builder.js'
import { ContactCreatedEvent } from '../contact-created.event.js'
import { FileNotFoundError } from '../../../../../modules/files/errors/file.not-found.error.js'
import { CreateContactRepository } from '../create-contact.repository.js'
import { generateFileUuid } from '../../../../../modules/files/entities/file.uuid.js'

describe('CreateContactUseCase Unit test', () => {
  before(() => {
    TestBench.setupUnitTest()
  })

  it('throws an error when the file does not exist', async () => {
    const contactRepo = createStubInstance(CreateContactRepository)
    contactRepo.fileExists.resolves(false)

    const useCase = new CreateContactUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      contactRepo
    )

    const fileUuid = generateFileUuid()

    const command = new CreateContactCommandBuilder()
      .withFileUuid(fileUuid)
      .build()

    await expect(useCase.execute(command))
      .rejects.toThrow(new FileNotFoundError(fileUuid))
  })

  it('the use cases calls the repository once', async () => {
    const eventEmitter = createStubInstance(DomainEventEmitter)

    const contactRepo = createStubInstance(CreateContactRepository)

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

    const contactRepo = createStubInstance(CreateContactRepository)
    contactRepo.fileExists.resolves(true)

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
