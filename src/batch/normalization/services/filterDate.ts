import { bool } from 'aws-sdk/clients/signer'
import { LabelStatus } from '../../../shared/domain/enums'
import { DecisionLabelDTO } from '../domain/decision.label.dto'

export function isDateCreationAfterDateDecision(decisionLabelDTO: DecisionLabelDTO): bool {
  return decisionLabelDTO.dateCreation > decisionLabelDTO.dateDecision
}

export function changeLabelStatusAccordingToDateExactitude(
  decisionLabelDTO: DecisionLabelDTO
): DecisionLabelDTO {
  if (isDateCreationAfterDateDecision(decisionLabelDTO)) {
    return { ...decisionLabelDTO, labelStatus: LabelStatus.TOIGNORE }
  } else {
    return decisionLabelDTO
  }
}
