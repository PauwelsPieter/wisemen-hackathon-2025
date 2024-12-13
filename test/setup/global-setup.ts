import { DataSource } from 'typeorm'
import type { TestingModule } from '@nestjs/testing'
import { Role } from '../../src/modules/roles/entities/role.entity.js'
import { TypesenseCollectionName } from '../../src/modules/typesense/enums/typesense-collection-index.enum.js'
import { TypesenseInitializationService } from '../../src/modules/typesense/services/typesense-initialization.service.js'
import { Permission } from '../../src/modules/permission/permission.enum.js'
import { compileTestModule } from './compile-test-module.js'

async function globalTestSetup (): Promise<void> {
  const testingModule = await compileTestModule([], true)

  await Promise.all([
    migrateTypesense(testingModule),
    migrateDatabase(testingModule)
  ])

  // eslint-disable-next-line no-console
  console.log('Global setup completed')
  await testingModule.close()
}

async function migrateTypesense (moduleRef: TestingModule): Promise<void> {
  const typesenseInitService = moduleRef.get(TypesenseInitializationService)

  await typesenseInitService.migrate(true, Object.values(TypesenseCollectionName))
}

async function migrateDatabase (testingModule: TestingModule): Promise<void> {
  const dataSource = testingModule.get(DataSource)

  if (!dataSource.isInitialized) await dataSource.initialize()

  await dataSource.runMigrations({ transaction: 'each' })

  const roleRepository = dataSource.getRepository(Role)

  const adminRole = { name: 'admin', permissions: [Permission.ADMIN] }
  const readonlyRole = { name: 'readonly', permissions: [Permission.READ_ONLY] }

  await roleRepository.upsert([adminRole, readonlyRole], { conflictPaths: { name: true } })
}

void globalTestSetup()
