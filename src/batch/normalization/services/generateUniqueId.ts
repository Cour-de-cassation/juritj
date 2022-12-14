import { MetadonneesDto } from 'src/shared/infrastructure/dto/metadonnees.dto'
import { CustomLogger } from '../../../shared/infrastructure/utils/log.utils'

const requiredKeys = ['idJuridiction', 'numeroRegistre', 'numeroRoleGeneral', 'dateDecision']
const optionalKey = 'numeroMesureInstruction'
const logger = new CustomLogger()

export function generateUniqueId(metadonnees: MetadonneesDto): string {
  if (hasMandatoryMetadonnees(metadonnees)) {
    const requiredMetadonnees =
      metadonnees.idJuridiction +
      metadonnees.numeroRegistre +
      metadonnees.numeroRoleGeneral +
      metadonnees.dateDecision

    const uniqueId =
      optionalKey in metadonnees
        ? requiredMetadonnees + metadonnees.numeroMesureInstruction
        : requiredMetadonnees
    logger.log('Normalization : added idDecision ' + uniqueId + ' to metadata')
    return uniqueId
  } else {
    logger.error(
      'Normalization : could not generate unique ID based on metadata: ' +
        JSON.stringify({
          idJuridiction: metadonnees.idJuridiction,
          numeroRegistre: metadonnees.numeroRegistre,
          numeroRoleGeneral: metadonnees.numeroRoleGeneral,
          dateDecision: metadonnees.dateDecision,
          numeroMesureInstruction: metadonnees.numeroMesureInstruction
        })
    )
    throw new Error('Normalization : could not generate unique ID based on metadata.')
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
