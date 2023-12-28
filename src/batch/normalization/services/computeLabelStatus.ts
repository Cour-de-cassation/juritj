import { DecisionTJDTO, LabelStatus } from 'dbsder-api-types'
import { logger } from '../index'
import { codeNACListNotPublic, codeNACListPartiallyPublic } from '../infrastructure/codeNACList'
import { LogsFormat } from '../../../shared/infrastructure/utils/logsFormat.utils'
import { normalizationFormatLogs } from '../index'
import { codeDecisionListTransmissibleToCC } from '../infrastructure/codeDecisionList'

const dateMiseEnService = new Date('2023-12-15')

export function computeLabelStatus(decisionDto: DecisionTJDTO): LabelStatus {
  const dateCreation = new Date(decisionDto.dateCreation)
  const dateDecision = new Date(decisionDto.dateDecision)

  const formatLogs: LogsFormat = {
    ...normalizationFormatLogs,
    operationName: 'computeLabelStatus',
    msg: 'Starting computeLabelStatus...'
  }

  if (isDecisionInTheFuture(dateCreation, dateDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Incorrect date, dateDecision must be before dateCreation.. Changing LabelStatus to ${LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE}.`
    })
    return LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE
  }

  if (isDecisionOlderThanSixMonths(dateCreation, dateDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Incorrect date, dateDecision must be less than 6 months old. Changing LabelStatus to ${LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE}.`
    })
    return LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE
  }

  if (isDecisionOlderThanMiseEnService(dateDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Incorrect date, dateDecision must be after mise en service. Changing LabelStatus to ${LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE}.`
    })
    return LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE
  }

  if (decisionDto.public === false) {
    logger.error({
      ...formatLogs,
      msg: `Decision is not public, changing LabelStatus to ${LabelStatus.IGNORED_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_DECISION_NON_PUBLIQUE
  }

  if (decisionDto.debatPublic === false) {
    logger.error({
      ...formatLogs,
      msg: `Decision debat is not public, changing LabelStatus to ${LabelStatus.IGNORED_DEBAT_NON_PUBLIC}.`
    })

    return LabelStatus.IGNORED_DEBAT_NON_PUBLIC
  }

  // We don't check if NACCode is provided because it is a mandatory field for TJ decisions (but optional for DBSDER API)
  if (isDecisionPartiallyPublic(decisionDto.NACCode)) {
    logger.info({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because NACCode indicates that the decision is partially public, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE
  }

  if (isDecisionNotPublic(decisionDto.NACCode)) {
    logger.info({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because NACCode indicates that the decision can not be public, changing LabelStatus to ${LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE}.`
    })
    return LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE
  }

  if (!isDecisionFromTJTransmissibleToCC(decisionDto.codeDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because codeDecision is not in authorized codeDecision list, changing LabelStatus to ${LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC}.`
    })
    return LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC
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
  return codeDecisionListTransmissibleToCC.includes(codeNAC)
}

function isDecisionOlderThanMiseEnService(dateDecision: Date): boolean {
  return dateDecision < dateMiseEnService
}

function isDecisionNotPublic(codeNAC: string): boolean {
  return codeNACListNotPublic.includes(codeNAC)
}

function isDecisionPartiallyPublic(codeNAC: string): boolean {
  return codeNACListPartiallyPublic.includes(codeNAC)
}
