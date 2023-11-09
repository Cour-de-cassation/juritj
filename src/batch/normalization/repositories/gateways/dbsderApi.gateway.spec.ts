import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import axios from 'axios'
import { DbSderApiGateway } from './dbsderApi.gateway'
import { MockUtils } from '../../../../shared/infrastructure/utils/mock.utils'

jest.mock('../../index', () => ({
  logger: {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  },

  normalizationFormatLogs: {
    operationName: 'normalizationJob',
    msg: 'Starting normalization job...'
  }
}))

jest.mock('axios')

describe('DbSderApi Gateway', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  const mockUtils = new MockUtils()
  const gateway = new DbSderApiGateway()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns the saved decision when dbSder API is called with valid parameters', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionMock
    mockedAxios.put.mockResolvedValueOnce({ data: mockUtils.decisionMock })

    // WHEN
    const result = await gateway.saveDecision(decisionToSave)

    // THEN
    expect(result).toEqual(decisionToSave)
  })

  it('throws a 400 Bad Request error when dbSder API is called with missing parameters', async () => {
    // GIVEN
    const incorrectDecisionToSave = mockUtils.decisionMock
    delete incorrectDecisionToSave.sourceId

    mockedAxios.put.mockRejectedValueOnce({
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

  it('throws a 401 Unauthorized error when normalization is not allowed to call dbSder API', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionMock
    mockedAxios.put.mockRejectedValueOnce({
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

  it('throws a 409 Conflict error when decision ID already exist in DBSDER API', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionMock
    mockedAxios.put.mockRejectedValueOnce({
      response: {
        data: {
          statusCode: HttpStatus.CONFLICT,
          message: ''
        }
      }
    })

    // WHEN
    expect(async () => await gateway.saveDecision(decisionToSave))
      // THEN
      .rejects.toThrow(ConflictException)
  })

  it('throws a 503 Unavailable error when dbSder API is unavailable', async () => {
    // GIVEN
    const decisionToSave = mockUtils.decisionMock
    mockedAxios.put.mockRejectedValueOnce({
      response: {
        data: {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: ''
        }
      }
    })

    // WHEN
    expect(async () => await gateway.saveDecision(decisionToSave))
      // THEN
      .rejects.toThrow(ServiceUnavailableException)
  })
})
