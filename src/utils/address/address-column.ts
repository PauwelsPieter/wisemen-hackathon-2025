import { EmbeddedColumn, EmbeddedColumnOptions } from '@wisemen/nestjs-typeorm'
import { Address } from './address.js'

export function AddressColumn (options?: EmbeddedColumnOptions) {
  return EmbeddedColumn(Address, options)
}
