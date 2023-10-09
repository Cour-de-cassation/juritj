import { hashDecisionId } from './hash.utils'
import { MockUtils } from './mock.utils'

describe('hashDecisionId', () => {
  it('returns hashed value of a normal string', () => {
    const hashedValue = hashDecisionId('test')
    expect(hashedValue).toEqual(2087933171)
  })
  it('returns the hashed valued of a decisionId-like string', () => {
    const decisionId = new MockUtils().uniqueDecisionId
    const hashedValue = hashDecisionId(decisionId)
    expect(hashedValue).toEqual(1616441172)
  })
})
