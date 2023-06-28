import { LabelStatus } from '../../../shared/domain/enums'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { updateLabelStatusIfDateDecisionIsInFuture } from './changeLabelStatus'

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
