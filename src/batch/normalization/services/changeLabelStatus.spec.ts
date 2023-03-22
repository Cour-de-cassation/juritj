import { LabelStatus } from '../../../shared/domain/enums'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { updateLabelStatusIfDateDecisionIsInFuture } from './changeLabelStatus'

jest.mock('../index', () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn()
  }
}))

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

  it('changes labelStatus to ignore when dateDecision is after dateCreation', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
      dateCreation: mockDateDecision.toISOString(),
      dateDecision: mockFutureDateDecision.toISOString()
    }

    const expectedDecision = { ...mockDecisionLabel, labelStatus: LabelStatus.TOIGNORE }

    // WHEN
    const checkedMappedDecision = updateLabelStatusIfDateDecisionIsInFuture(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })

  it('does not change labelStatus when dateDecision is before dateCreation', () => {
    // GIVEN
    const mockDecisionLabel = {
      ...new MockUtils().decisionLabelMock,
      dateCreation: mockDateDecision.toISOString(),
      dateDecision: mockPastDateDecision.toISOString()
    }
    const expectedDecision = mockDecisionLabel

    // WHEN
    const checkedMappedDecision = updateLabelStatusIfDateDecisionIsInFuture(mockDecisionLabel)

    // THEN
    expect(checkedMappedDecision).toEqual(expectedDecision)
  })
})
