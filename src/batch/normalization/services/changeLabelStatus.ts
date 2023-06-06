import { LabelStatus } from '../../../shared/domain/enums'
import { DecisionDTO } from '../infrastructure/decision.label.dto'
import { logger } from '../index'

export function updateLabelStatusIfDateDecisionIsInFuture(
  decisionLabelDTO: DecisionDTO
): DecisionDTO {
  // Hypothèse : le cas d'égalité est exclus car les décisions ne sont pas
  // transmises en temps réel

  if (decisionLabelDTO.dateCreation > decisionLabelDTO.dateDecision) {
    return decisionLabelDTO
  } else {
    logger.error(
      'Incorrect date, dateDecision must be before dateCreation. Changing LabelStatus to toIgnore.'
    )
    return { ...decisionLabelDTO, labelStatus: LabelStatus.TOIGNORE }
  }
}
