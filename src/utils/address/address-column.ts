import { plainToInstance } from 'class-transformer'
import { ColumnOptions, Column } from 'typeorm'
import { Address } from './address.js'

export function AddressColumn (options?: Omit<ColumnOptions, 'type' | 'transformer'>) {
  return Column({
    ...options,
    type: 'jsonb',
    transformer: {
      from (address: Address | null): Address | null {
        if (address === null) {
          return null
        }

        return plainToInstance(Address, address)
      },

      to (address: Address | null | undefined): Address | null | undefined {
        return address
      }
    }
  })
}
