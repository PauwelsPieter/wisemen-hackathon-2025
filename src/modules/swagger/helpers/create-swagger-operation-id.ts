export function createSwaggerOperationId (
  controllerKey: string,
  _methodKey: string,
  version?: string
): string {
  let opId = controllerKey.replace('Controller', '')

  if (version !== undefined) {
    opId = opId + `${version.toUpperCase()}`
  }

  return opId
}
