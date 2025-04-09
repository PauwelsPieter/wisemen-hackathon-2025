export function toBoolean (value: unknown): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'boolean') return value
  throw new Error('Invalid boolean string')
}
