export class MissingValue extends Error {
  type = 'missingValue' as const
  variableName: string
  constructor(variableName: string, message?: string) {
    const _message = message ? message : `${variableName} is required but missing.`
    super(_message)
    this.variableName = variableName
  }
}

export class BadFileFormat extends Error {
  type = 'badFileFormat' as const
  constructor(message?: string) {
    super(message ?? 'Le fichier doit être au format wordperfect (.wpd)')
  }
}

export class BadFileSize extends Error {
  type = 'badFileSize' as const
  maxSize: string
  constructor(maxSize: string) {
    super(`La taille du fichier dépasse la taille maximale autorisée de ${maxSize}`)
    this.maxSize = maxSize
  }
}

export class ValidationError extends Error {
  type = 'validationError' as const
  details: unknown
  constructor(message: string, details?: unknown) {
    super(message)
    this.details = details
  }
}

export class InfrastructureError extends Error {
  type = 'infrastructureError' as const
  constructor(message?: string) {
    super(message ?? "Une erreur inattendue liée à une dépendance de l'API a été rencontrée.")
  }
}

export class UnexpectedError extends Error {
  type = 'unexpectedError' as const
  constructor(message?: string) {
    super(message ?? 'Une erreur inattendue a été rencontrée.')
  }
}

type CustomError =
  | MissingValue
  | BadFileFormat
  | BadFileSize
  | ValidationError
  | InfrastructureError
  | UnexpectedError

export function isCustomError(x: unknown): x is CustomError {
  const isValidX = !!x && x instanceof Error && 'type' in x
  if (!isValidX) return false

  switch (x.type) {
    case 'missingValue':
    case 'badFileFormat':
    case 'badFileSize':
    case 'validationError':
    case 'infrastructureError':
    case 'unexpectedError':
      return true
    default:
      return false
  }
}
