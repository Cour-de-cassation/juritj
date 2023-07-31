import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { updateLabelStatus } from './changeLabelStatus'
import { LabelStatus } from 'dbsder-api-types'

jest.mock('../index', () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn()
  }
}))

const mockUtils = new MockUtils()
const dateNow = new Date()
const yesterday = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 1)

describe('updateLabelStatus', () => {
  let mockDecisionLabel = {
    ...mockUtils.decisionLabelMock,
    dateCreation: dateNow.toISOString(),
    dateDecision: yesterday.toISOString(),
    public: true
  }
  beforeEach(() => {
    mockDecisionLabel = {
      ...mockUtils.decisionLabelMock,
      dateCreation: dateNow.toISOString(),
      dateDecision: yesterday.toISOString(),
      public: true
    }
  })
  it('does not change labelStatus if it has no exceptions', () => {
    // GIVEN
    const expectedLabelStatus = LabelStatus.TOBETREATED
    // WHEN
    mockDecisionLabel.labelStatus = updateLabelStatus(mockDecisionLabel)

    // THEN
    expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
  })

  describe('changes labelStatus if it has exceptions', () => {
    it('returns labelStatus to "ignored_decisionDateIncoherente" when dateDecision is older than 6 months', () => {
      // GIVEN
      const dateSevenMonthsFromNow = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth() - 7,
        dateNow.getDate()
      )
      mockDecisionLabel = {
        ...mockUtils.decisionLabelMock,
        dateDecision: dateSevenMonthsFromNow.toISOString(),
        public: true
      }
      const expectedLabelStatus = LabelStatus.IGNORED_DATEDECISIONINCOHERENTE
      // WHEN
      mockDecisionLabel.labelStatus = updateLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
    it('returns labelStatus to "ignored_decisionNonPublique" when decision is not public', () => {
      // GIVEN
      const mockDecisionLabel = {
        ...new MockUtils().decisionLabelMock,
        public: false
      }
      const expectedLabelStatus = LabelStatus.IGNORED_DECISIONNONPUBLIQUE
      // WHEN
      mockDecisionLabel.labelStatus = updateLabelStatus(mockDecisionLabel)
      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
    it('returns labelStatus to "ignore" when dateDecision is in the future compared to dateCreation', () => {
      // GIVEN
      const dateInTheFuture = new Date(
        dateNow.getFullYear() + 1,
        dateNow.getMonth(),
        dateNow.getDate()
      )
      const mockDecisionLabel = {
        ...mockUtils.decisionLabelMock,
        dateCreation: dateNow.toISOString(),
        dateDecision: dateInTheFuture.toISOString()
      }
      const expectedLabelStatus = LabelStatus.TOIGNORE
      // WHEN
      mockDecisionLabel.labelStatus = updateLabelStatus(mockDecisionLabel)
      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
  })
})
