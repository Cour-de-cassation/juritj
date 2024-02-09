import { HttpException, HttpStatus } from '@nestjs/common'

export class BadPropertiesException extends HttpException {
  constructor(missingProperties: string[], value: Record<string, any>) {
    super(
      JSON.stringify({
        missingProperties: missingProperties,
        codeJuridiction: value.codeJuridiction,
        codeService: value.codeService,
        dateDecision: value.dateDecision,
        numeroRoleGeneral: value.numeroRoleGeneral,
        numeroRegistre: value.numeroRegistre
      }),
      HttpStatus.BAD_REQUEST
    )
  }
}
