import { logger } from '../index'
import { DecisionDTO, LabelStatus } from 'dbsder-api-types'

export function updateLabelStatus(decisionDto: DecisionDTO): LabelStatus {
  // this  function will be the hub of the differents conditions that may change the status
  const dateNow = new Date()
  const dateSixMonthsFromNow = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth() - 6,
    dateNow.getDate()
  )

  const isDecisionDateInTheFuture = decisionDto.dateCreation < decisionDto.dateDecision
  const isDecisionPublic = decisionDto.public
  const isDecisionDateOlderThanSixMonths =
    decisionDto.dateDecision < dateSixMonthsFromNow.toISOString()

  if (isDecisionDateInTheFuture) {
    logger.log(
      'Incorrect date, dateDecision must be before dateCreation. Changing LabelStatus to toIgnore.'
    )
    return LabelStatus.TOIGNORE
  }
  if (!isDecisionPublic) {
    logger.error('Decision is not public, changing LabelStatus to ignored_decisionNonPublique.')
    return LabelStatus.IGNORED_DECISIONNONPUBLIQUE
  }
  if (isDecisionDateOlderThanSixMonths) {
    logger.error(
      'Incorrect date, dateDecision must be less than 6 months old. Changing LabelStatus to ignored.'
    )
    return LabelStatus.IGNORED_DATEDECISIONINCOHERENTE
  }
  return decisionDto.labelStatus
}
