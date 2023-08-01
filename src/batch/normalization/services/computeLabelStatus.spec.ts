import { LabelStatus } from 'dbsder-api-types'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { computeLabelStatus } from './computeLabelStatus'

jest.mock('../index', () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn()
  }
}))

describe('updateLabelStatus', () => {
  const mockUtils = new MockUtils()
  describe('Returns provided labelStatus', () => {
    it('when decision is not ignored', () => {
      // GIVEN
      const dateDecember2022 = new Date(2022, 11, 31)
      const dateMarch2023 = new Date(2023, 2, 31)
      const mockDecisionLabel = {
        ...mockUtils.decisionLabelMock,
        dateDecision: dateDecember2022.toISOString(),
        dateCreation: dateMarch2023.toISOString(),
        public: true
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })

    it('when decisionDate is in September 2022 and dateCreation is in March 2023', () => {
      // GIVEN
      const dateSeptember2022 = new Date(2022, 8, 20)
      const dateMarch2023 = new Date(2023, 2, 25)
      const mockDecisionLabel = {
        ...mockUtils.decisionLabelMock,
        dateDecision: dateSeptember2022.toISOString(),
        dateCreation: dateMarch2023.toISOString(),
        public: true
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })

    it('when decisionDate is in January 2023 and dateCreation is in July 2023', () => {
      // GIVEN
      const dateJanuary2023 = new Date(2023, 0, 15)
      const dateJuly2023 = new Date(2023, 6, 20)
      const mockDecisionLabel = {
        ...mockUtils.decisionLabelMock,
        dateDecision: dateJanuary2023.toISOString(),
        dateCreation: dateJuly2023.toISOString(),
        public: true
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
  })

  describe('changes labelStatus if it has exceptions', () => {
    describe('returns ignored_decisionDateIncoherente', () => {
      it('when decision is older than 6 months', () => {
        // GIVEN
        const dateDecisionSevenMonthsBefore = new Date(2022, 11, 15)
        const dateCreation = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionLabelMock,
          dateDecision: dateDecisionSevenMonthsBefore.toISOString(),
          dateCreation: dateCreation.toISOString(),
          public: true
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATEDECISIONINCOHERENTE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when dateDecision is in the future compared to dateCreation', () => {
        // GIVEN
        const dateDecisionInTheFuture = new Date(2023, 7, 20)
        const dateCreation = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionLabelMock,
          dateDecision: dateDecisionInTheFuture.toISOString(),
          dateCreation: dateCreation.toISOString(),
          public: true
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATEDECISIONINCOHERENTE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    it('returns ignored_decisionNonPublique when decision is not public', () => {
      // GIVEN
      const mockDecisionLabel = {
        ...new MockUtils().decisionLabelMock,
        public: false
      }
      const expectedLabelStatus = LabelStatus.IGNORED_DECISIONNONPUBLIQUE

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
  })
})
