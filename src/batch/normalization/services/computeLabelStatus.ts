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
  const codeNACListTransmissibleToCC = [
    '11E',
    '11F',
    '22A',
    '22B',
    '22C',
    '22D',
    '22E',
    '22F',
    '22G',
    '22H',
    '22I',
    '22J',
    '22K',
    '22L',
    '22O',
    '22P',
    '33A',
    '33B',
    '33C',
    '33D',
    '33E',
    '33F',
    '448',
    '449',
    '44A',
    '44B',
    '44C',
    '44D',
    '44E',
    '44F',
    '44G',
    '44H',
    '44I',
    '44J',
    '44K',
    '44L',
    '558',
    '559',
    '55A',
    '55B',
    '55C',
    '55D',
    '55E',
    '55F',
    '55G',
    '55H',
    '55I',
    '55J',
    '55K',
    '55L'
  ]
  return codeNACListTransmissibleToCC.includes(codeNAC)
}
