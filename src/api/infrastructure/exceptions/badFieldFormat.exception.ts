import { HttpException, HttpStatus } from '@nestjs/common'

export class BadFieldFormatException extends HttpException {
  constructor(format: string, field: string) {
    super(`"Le format ${format} du champ ${field} est invalide`, HttpStatus.BAD_REQUEST)
  }
}
