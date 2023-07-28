import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import {
  updateLabelStatusIfDateDecisionIsInFuture,
  updateLabelStatusIfDecisionIsNotPublic
} from './changeLabelStatus'
import { LabelStatus } from 'dbsder-api-types'

jest.mock('../index', () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn()
  }
}))

describe('updateLabelStatusIfDateDecisionIsInFuture', () => {
  const dateNow = new Date()
  const dateInThePast = new Date(dateNow.getFullYear() - 1, dateNow.getMonth(), dateNow.getDate())
  const dateInTheFuture = new Date(dateNow.getFullYear() + 1, dateNow.getMonth(), dateNow.getDate())

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('changes labelStatus to "ignore" when dateDecision is in the future compared to dateCreation', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
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
      ...new MockUtils().decisionLabelMock,
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
