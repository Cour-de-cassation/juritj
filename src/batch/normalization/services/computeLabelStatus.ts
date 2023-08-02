import { logger } from '../index'
import { DecisionDTO, LabelStatus } from 'dbsder-api-types'

export function computeLabelStatus(decisionDto: DecisionDTO): LabelStatus {
  const dateCreation = new Date(decisionDto.dateCreation)
  const dateDecision = new Date(decisionDto.dateDecision)
  if (isDecisionInTheFuture(dateCreation, dateDecision)) {
    logger.error(
      'Incorrect date, dateDecision must be before dateCreation. Changing LabelStatus to ignored_dateDecisionIncoherente.'
    )
    return LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE
  }

  if (decisionDto.public === false) {
    logger.error('Decision is not public, changing LabelStatus to ignored_decisionNonPublique.')
    return LabelStatus.IGNORED_DECISION_NON_PUBLIQUE
  }

  if (isDecisionOlderThanSixMonths(dateCreation, dateDecision)) {
    logger.error(
      'Incorrect date, dateDecision must be less than 6 months old. Changing LabelStatus to ignored_dateDecisionIncoherente.'
    )
    return LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE
  }
  return decisionDto.labelStatus
}

function isDecisionInTheFuture(dateCreation: Date, dateDecision: Date): boolean {
  return dateDecision > dateCreation
}

function isDecisionOlderThanSixMonths(dateCreation: Date, dateDecision: Date): boolean {
  const monthDecision = new Date(dateDecision.getFullYear(), dateDecision.getMonth()).toISOString()
  const sixMonthsBeforeMonthCreation = new Date(
    dateCreation.getFullYear(),
    dateCreation.getMonth() - 6
  ).toISOString()
  return monthDecision < sixMonthsBeforeMonthCreation
}
