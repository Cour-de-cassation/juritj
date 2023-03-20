import { LabelStatus } from '../../../shared/domain/enums'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import {
  changeLabelStatusAccordingToDateExactitude,
  checkDecisionNormaliseeDateExactitude
} from './filterDate'

describe('filter date function', () => {
  const mockPastDateDecision = '2010-11-21'
  const mockFutureDateDecision = '2050-11-21'

  describe('checkDate function', () => {
    it('returns true if dateCreation is after dateDecision', () => {
      // GIVEN
      const mockMappedDecision = {
        ...new MockUtils().decisionLabelMock,
        dateDecision: mockPastDateDecision
      }

      // THEN
      expect(checkDecisionNormaliseeDateExactitude(mockMappedDecision)).toBe(true)
    })

    it('returns false if dateCreation is before dateDecision', () => {
      // GIVEN
      const mockMappedDecision = {
        ...new MockUtils().decisionLabelMock,
        dateDecision: mockFutureDateDecision
      }

      // THEN
      expect(checkDecisionNormaliseeDateExactitude(mockMappedDecision)).toBe(false)
    })
  })

  it('changes labelStatus to ignore when dateCreation is after dateDecision', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
      dateDecision: mockPastDateDecision
    }
    const expectedDecision = { ...mockDecisionLabel, labelStatus: LabelStatus.TOIGNORE }

    // WHEN
    const checkedMappedDecision = changeLabelStatusAccordingToDateExactitude(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })

  it('does not change labelStatus when dateCreation is before dateDecision', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
      dateDecision: mockFutureDateDecision
    }
    const expectedDecision = mockDecisionLabel

    // WHEN
    const checkedMappedDecision = changeLabelStatusAccordingToDateExactitude(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })
})
