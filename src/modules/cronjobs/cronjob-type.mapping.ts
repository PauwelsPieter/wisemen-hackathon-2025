import { CronjobType } from './enums/cronjob-type.enum.js'
import { ImportTypesenseModule } from './use-cases/import-typesense/import-typesense.module.js'
import { ImportTypesenseUseCase } from './use-cases/import-typesense/import-typesense.use-case.js'

export const CronjobTypeMapping = {
  [CronjobType.IMPORT_TYPESENSE]: {
    module: ImportTypesenseModule,
    useCase: ImportTypesenseUseCase
  }
}
