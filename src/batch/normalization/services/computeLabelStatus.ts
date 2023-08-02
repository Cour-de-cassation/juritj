import { logger } from '../index'
import { DecisionDTO, LabelStatus } from 'dbsder-api-types'
import { codeNACListTransmissibleToCC } from '../infrastructure/codeNACList'

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

  // We don't check if NACCode is provided because it is a mandatory field for TJ decisions (but optional for DBSDER API)
  if (!isDecisionFromTJTransmissibleToCC(decisionDto.NACCode)) {
    logger.error(
      'Decision can not be treated by Judilibre because NACCode is not in authorized NACCode list, changing LabelStatus to ignored_codeNACnonTransmisCC.'
    )
    return LabelStatus.IGNORED_CODE_NAC_NON_TRANSMIS_CC
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

function isDecisionFromTJTransmissibleToCC(codeNAC: string): boolean {
  return codeNACListTransmissibleToCC.includes(codeNAC)
}
