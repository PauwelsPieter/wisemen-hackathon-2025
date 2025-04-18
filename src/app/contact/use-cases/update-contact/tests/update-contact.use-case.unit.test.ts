import { before, describe, it } from 'node:test'
import { createStubInstance } from 'sinon'
import { expect } from 'expect'
import { ContactNotFoundError } from '../../../errors/contact.not-found.error.js'
import { TestBench } from '../../../../../../test/setup/test-bench.js'
import { stubDataSource } from '../../../../../../test/utils/stub-datasource.js'
import { ContactUpdatedEvent } from '../contact-updated.event.js'
import { UpdateContactCommandBuilder } from '../update-contact.command.builder.js'
import { DomainEventEmitter } from '../../../../../modules/domain-events/domain-event-emitter.js'
import { UpdateContactUseCase } from '../update-contact.use-case.js'
import { FileNotFoundError } from '../../../../../modules/files/errors/file.not-found.error.js'
import { generateContactUuid } from '../../../entities/contact.uuid.js'
import { UpdateContactRepository } from '../update-contact.repository.js'
import { generateFileUuid } from '../../../../../modules/files/entities/file.uuid.js'
import { ContactEntityBuilder } from '../../../entities/contact.entity.builder.js'

describe('UpdateContactUseCase Unit test', () => {
  before(() => {
    TestBench.setupUnitTest()
  })

  it('throws an error when the contact does not exist', async () => {
    const contactRepo = createStubInstance(UpdateContactRepository)

    contactRepo.findContact.resolves(null)

    const useCase = new UpdateContactUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      contactRepo
    )

    const command = new UpdateContactCommandBuilder().build()

    const contactUuid = generateContactUuid()

    await expect(useCase.execute(contactUuid, command))
      .rejects.toThrow(new ContactNotFoundError(contactUuid))
  })

  it('throws an error when the file does not exist', async () => {
    const contactRepo = createStubInstance(UpdateContactRepository)
    contactRepo.findContact.resolves(new ContactEntityBuilder().build())
    contactRepo.fileExists.resolves(false)

    const useCase = new UpdateContactUseCase(
      stubDataSource(),
      createStubInstance(DomainEventEmitter),
      contactRepo
    )

    const contactUuid = generateContactUuid()
    const fileUuid = generateFileUuid()

    const command = new UpdateContactCommandBuilder()
      .withFileUuid(fileUuid)
      .build()

    await expect(useCase.execute(contactUuid, command))
      .rejects.toThrow(new FileNotFoundError(contactUuid))
  })

  it('emits a contact updated event', async () => {
    const contactRepo = createStubInstance(UpdateContactRepository)
    contactRepo.findContact.resolves(new ContactEntityBuilder().build())
    contactRepo.fileExists.resolves(true)

    const eventEmitter = createStubInstance(DomainEventEmitter)

    const useCase = new UpdateContactUseCase(
      stubDataSource(),
      eventEmitter,
      contactRepo
    )

    const command = new UpdateContactCommandBuilder().build()
    const contactUuid = generateContactUuid()

    await useCase.execute(contactUuid, command)

    expect(eventEmitter).toHaveEmitted(new ContactUpdatedEvent(contactUuid))
  })
})
