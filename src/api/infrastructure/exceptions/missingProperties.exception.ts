import { HttpException, HttpStatus } from '@nestjs/common'

export class BadPropertiesException extends HttpException {
  constructor(missingProperties: string) {
    super(
      'Une ou plusieurs erreurs ont été trouvées sur les propriétés suivantes : ' +
        missingProperties,
      HttpStatus.BAD_REQUEST
    )
  }
}
