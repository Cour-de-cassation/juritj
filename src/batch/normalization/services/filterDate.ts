import { bool } from 'aws-sdk/clients/signer'
import { LabelStatus } from '../../../shared/domain/enums'
import { DecisionLabelDTO } from '../domain/decision.label.dto'

export function checkDecisionNormaliseeDateExactitude(decisionLabelDTO: DecisionLabelDTO): bool {
  if (decisionLabelDTO.dateCreation > decisionLabelDTO.dateDecision) {
    return true
  } else {
    return false
  }
}

export function changeLabelStatusAccordingToDateExactitude(
  decisionLabelDTO: DecisionLabelDTO
): DecisionLabelDTO {
  if (checkDecisionNormaliseeDateExactitude(decisionLabelDTO)) {
    return decisionLabelDTO
  } else {
    return { ...decisionLabelDTO, labelStatus: LabelStatus.TOIGNORE }
  }
}
