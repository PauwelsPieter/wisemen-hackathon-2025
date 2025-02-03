import { ConfigurableModuleBuilder } from '@nestjs/common'
import { CronjobConfig } from './cronjob.config.js'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
= new ConfigurableModuleBuilder<CronjobConfig>().build()
