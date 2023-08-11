import { logger } from '../index'
import { MetadonneesDto } from '../../../shared/infrastructure/dto/metadonnees.dto'
import { normalizationFormatLogs } from '../normalization'
import { LogsFormat } from 'src/shared/infrastructure/utils/logsFormat.utils'

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
    const formatLogs: LogsFormat = {
      ...normalizationFormatLogs,
      operationName: 'generateUniqueId',
      msg:
        'Could not generate unique ID based on metadata: ' +
        JSON.stringify({
          idJuridiction: metadonnees.idJuridiction,
          numeroRegistre: metadonnees.numeroRegistre,
          numeroRoleGeneral: metadonnees.numeroRoleGeneral,
          dateDecision: metadonnees.dateDecision
        })
    }
    logger.error(formatLogs)

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
