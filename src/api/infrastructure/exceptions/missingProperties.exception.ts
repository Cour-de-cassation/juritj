import { HttpException, HttpStatus } from '@nestjs/common'

export class BadPropertiesException extends HttpException {
  constructor(missingProperties: string[], value: Record<string, any>) {
    super(
      JSON.stringify({
        missingProperties: missingProperties,
        codeJuridiction: value.codeJuridiction,
        idJuridiction: value.idJuridiction,
        nomJuridiction: value.nomJuridiction,
        codeService: value.codeService,
        codeNature: value.codeNature,
        codeNAC: value.codeNAC,
        codeDecision: value.codeDecision,
        dateDecision: value.dateDecision,
        numeroRoleGeneral: value.numeroRoleGeneral,
        numeroRegistre: value.numeroRegistre
      }),
      HttpStatus.BAD_REQUEST
    )
  }
}
