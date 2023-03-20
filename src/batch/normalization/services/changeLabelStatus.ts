import { LabelStatus } from '../../../shared/domain/enums'
import { DecisionLabelDTO } from '../domain/decision.label.dto'
import { logger } from '../index'

export function changeLabelStatusAccordingToDateExactitude(
  decisionLabelDTO: DecisionLabelDTO
): DecisionLabelDTO {
  if (decisionLabelDTO.dateCreation > decisionLabelDTO.dateDecision) {
    return decisionLabelDTO
  } else {
    logger.error('[NORMALIZATION JOB] Incorrect date, dateDecision is posterior to dateCreation.')
    logger.log('[NORMALIZATION JOB] LabelStatus changes to toIgnore.')
    return { ...decisionLabelDTO, labelStatus: LabelStatus.TOIGNORE }
  }
}
