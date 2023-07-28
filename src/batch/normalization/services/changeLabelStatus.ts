import { logger } from '../index'
import { DecisionDTO, LabelStatus } from 'dbsder-api-types'

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

export function updateLabelStatusIfDecisionIsNotPublic(decisionLabelDTO: DecisionDTO): DecisionDTO {
  if (!decisionLabelDTO.public) {
    logger.error('Decision is not public, changing LabelStatus to ignored_decisionNonPublique.')
    return { ...decisionLabelDTO, labelStatus: LabelStatus.IGNORED_DECISIONNONPUBLIQUE }
  }
  return decisionLabelDTO
}

export function updateLabelStatusIfDateDecisionIsOlderThan6Months(decisionLabelDTO: DecisionDTO) {
  const dateNow = new Date()
  const dateSixMonthsFromNow = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth() - 6,
    dateNow.getDate()
  )
  if (decisionLabelDTO.dateDecision > dateSixMonthsFromNow.toISOString()) {
    return decisionLabelDTO
  } else {
    logger.error(
      'Incorrect date, dateDecision must be less than 6 months old. Changing LabelStatus to ignored.'
    )
    return { ...decisionLabelDTO, labelStatus: LabelStatus.IGNORED_DATEDECISIONINCOHERENTE }
  }
}
