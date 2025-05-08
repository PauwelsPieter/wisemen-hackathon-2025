import { OpenAPIObject } from '@nestjs/swagger'

export function buildErrorDocumentation (error: unknown): OpenAPIObject {
  const errorMessage = error as { message?: string } ?? 'Unknown error'

  return {
    info: {
      title: 'Something went wrong',
      version: '',
      description: `An error occurred while generating the documentation:\n
      ${errorMessage.message} `
    },
    openapi: '3.1.0',
    paths: {}
  }
}
