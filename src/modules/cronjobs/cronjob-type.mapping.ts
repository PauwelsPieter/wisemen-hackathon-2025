import { CronjobType } from './enums/cronjob-type.enum.js'

export const CronjobTypeMapping = {
  [CronjobType.IMPORT_TYPESENSE]: async () => {
    return {
      module: (await import('./use-cases/import-typesense/import-typesense.module.js')).ImportTypesenseModule,
      useCase: (await import('./use-cases/import-typesense/import-typesense.use-case.js')).ImportTypesenseUseCase
    }
  }
}
