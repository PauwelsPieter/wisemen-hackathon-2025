import { I18nContext, type TranslateOptions } from 'nestjs-i18n'
import type { I18nPath } from '../generated/i18n.generated.js'
import { LocalizationModule } from '../modules/localization.module.js'
import { MISSING_TRANSLATION_KEY } from '../constants/defaults.constant.js'

/*
* Context aware translation functions
* Primary use case is for translations in controllers, services etc.
*/

export function translateCurrent (key: I18nPath, options?: TranslateOptions): string {
  return translateCurrentRaw(key, options)
}

export function tc (key: I18nPath, options?: TranslateOptions): string {
  return translateCurrent(key, options)
}

export function translateCurrentRaw (key: string, options?: TranslateOptions): string {
  const context = I18nContext.current()

  if (context === undefined) {
    throw new Error(
      'Attempting to translate with context in a contextless environment. '
      + 'Did you mean to call translate instead of translateCurrent?'
    )
  }

  if (options?.defaultValue === undefined && key !== MISSING_TRANSLATION_KEY) {
    options ??= {}
    options.defaultValue = tc(MISSING_TRANSLATION_KEY, { args: { key } })
  }

  return context.translate(key, options)
}

export function tcr (key: string, options?: TranslateOptions): string {
  return translateCurrentRaw(key, options)
}

/**
 * Context unaware translation functions
 * Primary use case is for translations in worker for mails, notifications etc.
 */

/**
 * @remarks Language should be explicitly set in the options or the default language will be used
 */
export function translate (key: I18nPath, options?: TranslateOptions): string {
  return translateRaw(key, options)
}

/**
 * @remarks Language should be explicitly set in the options or the default language will be used
 */
export function t (key: I18nPath, options?: TranslateOptions): string {
  return translate(key, options)
}

/**
 * @remarks Language should be explicitly set in the options or the default language will be used
 */
export function translateRaw (key: string, options?: TranslateOptions): string {
  const service = LocalizationModule.default()

  if (service === undefined) return key

  if (options?.defaultValue === undefined && key !== MISSING_TRANSLATION_KEY) {
    options ??= {}
    options.defaultValue = t(MISSING_TRANSLATION_KEY, { args: { key } })
  }

  return service.translate(key, options)
}

/**
 * @remarks Language should be explicitly set in the options or the default language will be used
 */
export function tr (key: string, options?: TranslateOptions): string {
  return translateRaw(key, options)
}
