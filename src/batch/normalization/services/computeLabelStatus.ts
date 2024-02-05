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

const authorizedCharacters = [
  '\t',
  '\n',
  '\x0b',
  '\x0c',
  '\r',
  '\x1c',
  '\x1d',
  '\x1e',
  '\x1f',
  ' ',
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '`',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '{',
  '|',
  '}',
  '~',
  '\x85',
  '\xa0',
  '§',
  '«',
  '°',
  '²',
  'µ',
  '·',
  '»',
  '¼',
  '½',
  '¾',
  'À',
  'Á',
  'Â',
  'Ã',
  'Ä',
  'Å',
  'Æ',
  'Ç',
  'È',
  'É',
  'Ê',
  'Ë',
  'Ì',
  'Í',
  'Î',
  'Ï',
  'Ð',
  'Ñ',
  'Ò',
  'Ó',
  'Ô',
  'Õ',
  'Ö',
  '×',
  'Ø',
  'Ù',
  'Ú',
  'Û',
  'Ü',
  'Ý',
  'Þ',
  'ß',
  'à',
  'á',
  'â',
  'ã',
  'ä',
  'å',
  'æ',
  'ç',
  'è',
  'é',
  'ê',
  'ë',
  'ì',
  'í',
  'î',
  'ï',
  'ð',
  'ñ',
  'ò',
  'ó',
  'ô',
  'õ',
  'ö',
  '÷',
  'ø',
  'ù',
  'ú',
  'û',
  'ü',
  'ý',
  'þ',
  'ÿ',
  'Œ',
  'œ',
  'μ',
  '\u1680',
  '\u2000',
  '\u2001',
  '\u2002',
  '\u2003',
  '\u2004',
  '\u2005',
  '\u2006',
  '\u2007',
  '\u2008',
  '\u2009',
  '\u200a',
  '‒',
  '–',
  '—',
  '‘',
  '’',
  '“',
  '”',
  '•',
  '…',
  '\u2028',
  '\u2029',
  '\u202f',
  '›',
  '\u205f',
  '€',
  '→',
  '⇒',
  '−',
  '■',
  '▪',
  '▸',
  '○',
  '●',
  '☎',
  '☒',
  '✉',
  '✏',
  '✭',
  '❑',
  '❒',
  '❖',
  '➔',
  '➢',
  '\u3000'
]

const authorizedSet = new Set(authorizedCharacters)

function decisionContainsOnlyAuthorizedCharacters(originalText: string): boolean {
  for (let i = 0; i < originalText.length; i++) {
    if (!authorizedSet.has(originalText[i])) {
      // Character not found in authorizedSet
      return false
    }
  }
  return true
}
