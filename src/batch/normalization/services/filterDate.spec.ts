import { LabelStatus } from '../../../shared/domain/enums'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import {
  changeLabelStatusAccordingToDateExactitude,
  isDateCreationAfterDateDecision
} from './filterDate'

describe('filter date function', () => {
  const mockDateDecision = new Date()
  const mockPastDateDecision = new Date(
    mockDateDecision.getFullYear() - 1,
    mockDateDecision.getMonth(),
    mockDateDecision.getDate()
  )
  const mockFutureDateDecision = new Date(
    mockDateDecision.getFullYear() + 1,
    mockDateDecision.getMonth(),
    mockDateDecision.getDate()
  )

  describe('isDateCreationAfterDateDecision function', () => {
    it('returns true if dateCreation is after dateDecision', () => {
      // GIVEN
      const mockMappedDecision = {
        ...new MockUtils().decisionLabelMock,
        dateDecision: mockPastDateDecision.toISOString()
      }

      // WHEN
      const boolDateCreationAfterDateDecision = isDateCreationAfterDateDecision(mockMappedDecision)

      // THEN
      expect(boolDateCreationAfterDateDecision).toBe(true)
    })

    it('returns false if dateCreation is before dateDecision', () => {
      // GIVEN
      const mockMappedDecision = {
        ...new MockUtils().decisionLabelMock,
        dateDecision: mockFutureDateDecision.toISOString()
      }

      // WHEN
      const boolDateCreationAfterDateDecision = isDateCreationAfterDateDecision(mockMappedDecision)

      // THEN
      expect(boolDateCreationAfterDateDecision).toBe(false)
    })
  })

  it('changes labelStatus to ignore when dateCreation is after dateDecision', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
      dateDecision: mockPastDateDecision.toISOString()
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
      dateDecision: mockFutureDateDecision.toISOString()
    }
    const expectedDecision = mockDecisionLabel

    // WHEN
    const checkedMappedDecision = changeLabelStatusAccordingToDateExactitude(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })
})
