import {
  BadRequestException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import { DbSderApiGateway } from './dbsderApi.gateway'
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
  it('Returns the decision saved if dbSder API is called with valid parameters', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionLabelMock
    mockedAxios.post.mockResolvedValueOnce(mockUtils.decisionLabelMock)

    // WHEN
    const result = await gateway.saveDecision(decisionToSave)

    // THEN
    expect(result).toEqual(decisionToSave)
  })

  it('Returns a bad request error when dbSder API is called with missing parameters', async () => {
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

  it('Returns an unauthorized error when normalization is not allowed to call dbSder API', async () => {
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

  it('Throws an unavailable error when dbSder API is unavailable', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionLabelMock
    mockedAxios.post.mockRejectedValueOnce({})

    // WHEN
    expect(async () => await gateway.saveDecision(decisionToSave))
      // THEN
      .rejects.toThrow(ServiceUnavailableException)
  })
})