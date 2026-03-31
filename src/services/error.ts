export class NotSupported extends Error {
  type = 'notSupported' as const
  variableName: string
  variableValue: unknown
  message: string

  constructor(variableName: string, variableValue: unknown, message?: string) {
    const _message = message
      ? message
      : `value: ${variableValue} is not supported to ${variableName}.`
    super()
    this.variableName = variableName
    this.variableValue = variableValue
    this.message = _message
  }
}

export function toNotSupported(variableName: string, variableValue: unknown, error: Error) {
  return new NotSupported(variableName, variableValue, error.message)
}

export class MissingValue extends Error {
  type = 'missingValue' as const
  variableName: string
  constructor(variableName: string, message?: string) {
    const _message = message ? message : `${variableName} is required but missing.`
    super(_message)
    this.variableName = variableName
  }
}

export class NotFound extends Error {
  type = 'notFound' as const
  variableName: string
  constructor(variableName: string, message?: string) {
    const _message = message ? message : `${variableName} not found.`
    super(_message)
    this.variableName = variableName
  }
}

export class UnauthorizedError extends Error {
  type = 'unauthorizedError' as const
  constructor(message?: string) {
    const _message = message ? message : "Vous n'êtes pas autorisé à appeler cette route"
    super(_message)
  }
}

export class InfrastructureError extends Error {
  type = 'infrastructureError' as const
  constructor(reason: string) {
    super('Une erreur de dépendance a eu lieu : ' + reason)
  }
}

export class UnexpectedError extends Error {
  type = 'unexpectedError' as const
  constructor(message?: string) {
    const _message = message ? message : 'Unexepected error occurs.'
    super(_message)
  }
}

export function toUnexpectedError(error: any) {
  if (!(error instanceof Error)) return new UnexpectedError(`${error}`)

  const unexpected = new UnexpectedError()
  if (error.message?.length > 0) unexpected.message = error.message
  if ((error.stack?.length ?? 0) > 0) unexpected.stack = error.stack
  return unexpected
}

export class BucketError extends Error {
  constructor(reason: string) {
    super(`Erreur sur l'API S3 : ${reason}`)
  }
}

type CustomError =
  | NotSupported
  | MissingValue
  | NotFound
  | UnauthorizedError
  | InfrastructureError
  | UnexpectedError

export function isCustomError(x: any): x is CustomError {
  switch (x.type) {
    case 'notSupported':
    case 'notFound':
    case 'missingValue':
    case 'unauthorizedError':
    case 'infrastructureError':
    case 'unexpectedError':
      return x instanceof Error
    default:
      return false
  }
}
