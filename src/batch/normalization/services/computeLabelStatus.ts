import { DecisionTJDTO, LabelStatus } from 'dbsder-api-types'
import { logger } from '../index'
import { LogsFormat } from '../../../shared/infrastructure/utils/logsFormat.utils'
import { normalizationFormatLogs } from '../index'
import { codeDecisionListNotTransmissibleToCC } from '../infrastructure/codeDecisionList'
import { authorizedCharacters } from '../infrastructure/authorizedCharactersList'

const dateMiseEnService = getMiseEnServiceDate()
const authorizedCharactersdSet = new Set(authorizedCharacters)

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

  if (isDecisionOlderThanMiseEnService(dateDecision)) {
    logger.error({
      ...formatLogs,
      msg: `Incorrect date, dateDecision must be after mise en service. Changing LabelStatus to ${LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE}.`
    })
    return LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE
  }

  if (!isDecisionFromTJTransmissibleToCC(decisionDto.endCaseCode)) {
    logger.error({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because codeDecision is in blocked codeDecision list, changing LabelStatus to ${LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC}.`
    })
    return LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC
  }

  if (!decisionContainsOnlyAuthorizedCharacters(decisionDto.originalText)) {
    logger.error({
      ...formatLogs,
      msg: `Decision can not be treated by Judilibre because its text contains unknown characters, changing LabelStatus to ${LabelStatus.IGNORED_CARACTERE_INCONNU}.`
    })
    return LabelStatus.IGNORED_CARACTERE_INCONNU
  }

  return decisionDto.labelStatus
}

function isDecisionInTheFuture(dateCreation: Date, dateDecision: Date): boolean {
  return dateDecision > dateCreation
}

function isDecisionFromTJTransmissibleToCC(endCaseCode: string): boolean {
  return !codeDecisionListNotTransmissibleToCC.includes(endCaseCode)
}

function isDecisionOlderThanMiseEnService(dateDecision: Date): boolean {
  return dateDecision < dateMiseEnService
}

function decisionContainsOnlyAuthorizedCharacters(originalText: string): boolean {
  for (let i = 0; i < originalText.length; i++) {
    if (!authorizedCharactersdSet.has(originalText[i])) {
      // Character not found in authorizedSet
      return false
    }
  }
  return true
}

function getMiseEnServiceDate(): Date {
  if (!isNaN(new Date(process.env.COMMISSIONING_DATE).getTime())) {
    return new Date(process.env.COMMISSIONING_DATE)
  } else {
    return new Date('2023-12-15')
  }
}
