import { HttpException, HttpStatus } from '@nestjs/common'

export class BadFileFormatException extends HttpException {
  constructor() {
    super(
      "Vous devez fournir un fichier 'decisionIntegre' au format Wordperfect.",
      HttpStatus.BAD_REQUEST
    )
  }
}

export class BadFileSizeException extends HttpException {
  constructor(readableBytes) {
    super(
      `Vous devez fournir un fichier 'decisionIntegre' de moins de ${readableBytes}.`,
      HttpStatus.BAD_REQUEST
    )
  }
}
