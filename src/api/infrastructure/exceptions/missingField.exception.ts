import { HttpException, HttpStatus } from '@nestjs/common'

export class MissingFieldException extends HttpException {
  constructor(missingField: string) {
    super('Vous devez fournir le champ: ' + missingField, HttpStatus.BAD_REQUEST)
  }
}
