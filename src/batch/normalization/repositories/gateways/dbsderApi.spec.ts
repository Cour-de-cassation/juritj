import { HttpStatus, ServiceUnavailableException } from '@nestjs/common'
import { DbSderApiGateway } from './dbsderApi'
import { MockUtils } from '../../../../shared/infrastructure/utils/mock.utils'

jest.mock('../../index', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn()
  },
  normalizationContext: {
    start: jest.fn(),
    setCorrelationId: jest.fn()
  }
}))

describe.skip('DbSderApi', () => {
  const mockUtils = new MockUtils()
  const gateway = new DbSderApiGateway()
  it('Returns 201 - if  dbSder API is called with valid parameters', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionLabelMock

    // WHEN
    const result = await gateway.saveDecision(decisionToSave)

    // THEN
    expect(result.status).toEqual(HttpStatus.CREATED)
  })

  it('Returns 400 - if  dbSder API is called with invalid parameters', async () => {
    // GIVEN
    const incorrectDecisionToSave = mockUtils.decisionLabelMock
    delete incorrectDecisionToSave.sourceId

    // WHEN
    const result = await gateway.saveDecision(incorrectDecisionToSave)
    // THEN

    expect(result.status).toEqual(HttpStatus.BAD_REQUEST)
  })

  it('Returns 401 - if normalization is not allowed to call dbSder API', async () => {
    // GIVEN
    const incorrectDecisionToSave = mockUtils.decisionLabelMock
    delete incorrectDecisionToSave.sourceId

    // WHEN
    const result = await gateway.saveDecision(incorrectDecisionToSave)
    // THEN

    expect(result.status).toEqual(HttpStatus.UNAUTHORIZED)
  })

  it('Throws 503 - if  dbSder API is unavailable', async () => {
    // GIVEN
    const incorrectDecisionToSave = mockUtils.decisionLabelMock
    delete incorrectDecisionToSave.sourceId

    // WHEN

    expect(await gateway.saveDecision(incorrectDecisionToSave))
      // THEN
      .toThrow(new ServiceUnavailableException())
  })
})
