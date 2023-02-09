import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import mongoose from 'mongoose'
import { mapDecisionNormaliseeToLabelDecision } from './decision.label.dto'

jest.mock('../index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  }
}))

describe('mapDecisionNormaliseeToDecisionLabel', () => {
  it('returns the correct object', async () => {
    // GIVEN
    const mockDecision = new MockUtils().decisionMock

    // WHEN
    const decisionLabel = mapDecisionNormaliseeToLabelDecision(mockDecision)

    expect(decisionLabel).toEqual({})
  })
})
