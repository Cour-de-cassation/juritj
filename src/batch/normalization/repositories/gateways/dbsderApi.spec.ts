import {
  BadRequestException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import { DbSderApiGateway } from './dbsderApi'
import { MockUtils } from '../../../../shared/infrastructure/utils/mock.utils'
import axios from 'axios'

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
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('DbSderApi', () => {
  const mockUtils = new MockUtils()
  const gateway = new DbSderApiGateway()
  it('Returns 201 - if  dbSder API is called with valid parameters', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionLabelMock
    mockedAxios.post.mockResolvedValueOnce(mockUtils.decisionLabelMock)

    // WHEN
    const result = await gateway.saveDecision(decisionToSave)

    // THEN
    expect(result).toEqual(decisionToSave)
  })

  it('Returns 400 if  dbSder API is called with invalid parameters', async () => {
    // GIVEN
    const incorrectDecisionToSave = mockUtils.decisionLabelMock
    delete incorrectDecisionToSave.sourceId

    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ''
        }
      }
    })

    // WHEN
    expect(async () => await gateway.saveDecision(incorrectDecisionToSave))
      // THEN
      .rejects.toThrow(BadRequestException)
  })

  it('Returns 401 if normalization is not allowed to call dbSder API', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionLabelMock
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: ''
        }
      }
    })

    // WHEN
    expect(async () => await gateway.saveDecision(decisionToSave))
      // THEN
      .rejects.toThrow(UnauthorizedException)
  })

  it('Throws 503 if  dbSder API is unavailable', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionLabelMock
    mockedAxios.post.mockRejectedValueOnce({})

    // WHEN
    expect(async () => await gateway.saveDecision(decisionToSave))
      // THEN
      .rejects.toThrow(ServiceUnavailableException)
  })
})
