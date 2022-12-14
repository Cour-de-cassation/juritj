import { CustomLogger } from '../../shared/infrastructure/utils/log.utils'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'

const metadonnees = new MockUtils().metadonneesDtoMock
const requiredKeys = ['idJuridiction', 'numeroRegistre', 'numeroRoleGeneral', 'dateDecision']
const optionalKey = 'numeroMesureInstruction'
const logger = new CustomLogger()

export function generateIdDecision(metadonnees): void {
  if (hasMandatoryMetadonnees(metadonnees)) {
    const requiredMetadonnees =
      metadonnees.idJuridiction +
      metadonnees.numeroRegistre +
      metadonnees.numeroRoleGeneral +
      metadonnees.dateDecision

    metadonnees.idDecision =
      optionalKey in metadonnees
        ? requiredMetadonnees + metadonnees.numeroMesureInstruction
        : requiredMetadonnees
    logger.log('Normalization : added idDecision ' + metadonnees.idDecision + ' to metadata')
  } else {
    logger.error('Normalization : could not add idDecision to metadata')
  }
}

function hasMandatoryMetadonnees(metadonnees): boolean {
  for (const key of requiredKeys) {
    if (!(key in metadonnees)) {
      return false
    }
  }
  return true
}

generateIdDecision(metadonnees)
