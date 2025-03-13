import { type ExceptionFilter, Catch, type ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { EntityNotFoundError } from 'typeorm'
import { trace } from '@opentelemetry/api'
import { JsonApiError } from './types/json-api-error.type.js'
import { NotFoundError } from './generic/not-found.error.js'
import { ApiError } from './api-errors/api-error.js'
import { CompositeApiError } from './api-errors/composite.api-error.js'
import { ServiceUnavailableApiError, ServiceUnavailableErrorContent } from './api-errors/service-unavailable.api-error.js'
import { InternalServerErrorContent } from './api-errors/internal-server.api-error.js'

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor (
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  public catch (exception: Error, host: ArgumentsHost): void {
    const { status, errors } = this.handleException(exception)

    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    httpAdapter.reply(
      ctx.getResponse(),
      { errors, traceId: trace.getActiveSpan()?.spanContext()?.traceId },
      status
    )
  }

  private handleException (exception: Error): JsonApiError {
    if (exception instanceof JsonApiError) {
      return exception
    }

    if (exception instanceof CompositeApiError) {
      return this.mapCompositeApiErrorToJsonApiError(exception)
    }

    if (exception instanceof ApiError) {
      return this.mapApiErrorToJsonApiError(exception)
    }

    if (exception instanceof HttpException) {
      return this.mapHttpExceptionToJsonApiError(exception)
    }

    if (exception instanceof EntityNotFoundError) {
      return this.mapApiErrorToJsonApiError(
        new NotFoundError()
      )
    }

    return this.mapUnknownErrorToJsonApiError(exception)
  }

  private mapCompositeApiErrorToJsonApiError (error: CompositeApiError) {
    return new JsonApiError(
      error.status,
      error.errors
    )
  }

  private mapApiErrorToJsonApiError (error: ApiError): JsonApiError {
    if (error instanceof ServiceUnavailableApiError) {
      return this.mapServiceUnavailableError(error)
    }

    return new JsonApiError(
      Number(error.status),
      [{
        code: error.code,
        detail: error.detail,
        status: error.status,
        meta: error.meta
      }]
    )
  }

  private mapHttpExceptionToJsonApiError (exception: HttpException): JsonApiError {
    return new JsonApiError(
      exception.getStatus(),
      [{
        status: exception.getStatus().toString(),
        code: exception.name,
        detail: exception.message
      }]
    )
  }

  private mapServiceUnavailableError (error: ApiError): JsonApiError {
    return new JsonApiError(
      HttpStatus.SERVICE_UNAVAILABLE,
      [new ServiceUnavailableErrorContent(error)]
    )
  }

  private mapUnknownErrorToJsonApiError (error: Error): JsonApiError {
    return new JsonApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      [new InternalServerErrorContent(error)]
    )
  }
}
