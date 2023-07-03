import { HttpException, HttpStatus } from '@nestjs/common'

export class BadFileFormatException extends HttpException {
  constructor() {
    super(
      "Vous devez fournir un fichier 'decisionIntegre' au format Wordperfect.",
      HttpStatus.BAD_REQUEST
    )
  }
}
