import { logger } from '../index'
import { MetadonneesDto } from '../../../shared/infrastructure/dto/metadonnees.dto'

const requiredKeys = ['idJuridiction', 'numeroRegistre', 'numeroRoleGeneral', 'dateDecision']

export function generateUniqueId(metadonnees: MetadonneesDto): string {
  if (hasMandatoryMetadonnees(metadonnees)) {
    const uniqueId =
      metadonnees.idJuridiction +
      metadonnees.numeroRegistre +
      metadonnees.numeroRoleGeneral +
      metadonnees.dateDecision

    return uniqueId.replaceAll('/', '-')
  } else {
    logger.error({
      operationName: 'generateUniqueId',
      msg:
        'Could not generate unique ID based on metadata: ' +
        JSON.stringify({
          idJuridiction: metadonnees.idJuridiction,
          numeroRegistre: metadonnees.numeroRegistre,
          numeroRoleGeneral: metadonnees.numeroRoleGeneral,
          dateDecision: metadonnees.dateDecision
        })
    })

    throw new Error('Could not generate unique ID based on metadata.')
  }
}

function hasMandatoryMetadonnees(metadonnees): boolean {
  for (const key of requiredKeys) {
    if (!(key in metadonnees) || metadonnees[key] === '') {
      return false
    }
  }
  return true
}
