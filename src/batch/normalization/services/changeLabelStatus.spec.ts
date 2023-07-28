import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import {
  updateLabelStatusIfDateDecisionIsInFuture,
  updateLabelStatusIfDateDecisionIsOlderThan6Months,
  updateLabelStatusIfDecisionIsNotPublic
} from './changeLabelStatus'
import { LabelStatus } from 'dbsder-api-types'

jest.mock('../index', () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn()
  }
}))

const mockUtils = new MockUtils()
const dateNow = new Date()

describe('updateLabelStatusIfDateDecisionIsInFuture', () => {
  const dateInThePast = new Date(dateNow.getFullYear() - 1, dateNow.getMonth(), dateNow.getDate())
  const dateInTheFuture = new Date(dateNow.getFullYear() + 1, dateNow.getMonth(), dateNow.getDate())

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('changes labelStatus to "ignore" when dateDecision is in the future compared to dateCreation', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...mockUtils.decisionLabelMock,
      dateCreation: dateNow.toISOString(),
      dateDecision: dateInTheFuture.toISOString()
    }

    const expectedDecision = { ...mockDecisionLabel, labelStatus: LabelStatus.TOIGNORE }

    // WHEN
    const checkedMappedDecision = updateLabelStatusIfDateDecisionIsInFuture(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })

  it('does not change labelStatus when dateDecision is in the past compared to dateCreation', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...mockUtils.decisionLabelMock,
      dateCreation: dateNow.toISOString(),
      dateDecision: dateInThePast.toISOString()
    }
    const expectedDecision = mockDecisionLabel

    // WHEN
    const checkedMappedDecision = updateLabelStatusIfDateDecisionIsInFuture(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })
})
describe('updateLabelStatusIfDecisionIsNotPublic', () => {
  it('changes labelStatus to ignored_decisionNonPublique when decision is not public', () => {
    // GIVEN
    const expectedLabelStatus = LabelStatus.IGNORED_DECISIONNONPUBLIQUE
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
      public: false
    }
    // WHEN
    const checkedMappedDecision = updateLabelStatusIfDecisionIsNotPublic(mockDecisionLabel)
    // THEN
    expect(checkedMappedDecision.labelStatus).toEqual(expectedLabelStatus)
  })

  it('does not change labelStatus when decision is public', () => {
    // GIVEN
    const expectedLabelStatus = LabelStatus.TOBETREATED
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
      public: true
    }
    // WHEN
    const checkedMappedDecision = updateLabelStatusIfDecisionIsNotPublic(mockDecisionLabel)
    // THEN
    expect(checkedMappedDecision.labelStatus).toEqual(expectedLabelStatus)
  })
})

describe('updateLabelStatusIfDateDecisionIsOlderThan6Months', () => {
  it('changes labelStatus to "ignored" when dateDecision is older than 6 months', () => {
    // GIVEN
    const dateSevenMonthsFromNow = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth() - 7,
      dateNow.getDate()
    )
    const mockDecisionLabel = {
      ...mockUtils.decisionLabelMock,
      dateDecision: dateSevenMonthsFromNow.toISOString()
    }
    const expectedDecision = {
      ...mockDecisionLabel,
      labelStatus: LabelStatus.IGNORED_DATEDECISIONINCOHERENTE
    }
    // WHEN
    const checkedMappedDecision =
      updateLabelStatusIfDateDecisionIsOlderThan6Months(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })

  it('does not change labelStatus when dateDecision is less than 6 months', () => {
    // GIVEN
    const dateFiveMonthsFromNow = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth() - 5,
      dateNow.getDate()
    )
    const mockDecisionLabel = {
      ...mockUtils.decisionLabelMock,
      dateDecision: dateFiveMonthsFromNow.toISOString()
    }
    const expectedDecision = mockDecisionLabel
    // WHEN
    const checkedMappedDecision =
      updateLabelStatusIfDateDecisionIsOlderThan6Months(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })
})
