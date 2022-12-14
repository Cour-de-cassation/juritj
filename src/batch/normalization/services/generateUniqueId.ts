import { MetadonneesDto } from '../../../shared/infrastructure/dto/metadonnees.dto'
import { CustomLogger } from '../../../shared/infrastructure/utils/customLogger.utils'

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
    logger.log('[NORMALIZATION JOB] Unique ID generated.', uniqueId)
    return uniqueId
  } else {
    logger.error(
      '[NORMALIZATION JOB] Could not generate unique ID based on metadata: ' +
        JSON.stringify({
          idJuridiction: metadonnees.idJuridiction,
          numeroRegistre: metadonnees.numeroRegistre,
          numeroRoleGeneral: metadonnees.numeroRoleGeneral,
          dateDecision: metadonnees.dateDecision,
          numeroMesureInstruction: metadonnees.numeroMesureInstruction
        })
    )
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
