import { CronjobType } from './enums/cronjob-type.enum.js'

export const CronjobTypeMapping = {
  [CronjobType.IMPORT_TYPESENSE]: async () => {
    return {
      module: (await import('../typesense/cronjobs/import-typesense/import-typesense.module.js')).ImportTypesenseModule,
      useCase: (await import('../typesense/cronjobs/import-typesense/import-typesense.use-case.js')).ImportTypesenseUseCase
    }
  }
}
