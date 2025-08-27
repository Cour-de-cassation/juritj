import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import axios from 'axios'
import { logger, normalizationFormatLogs } from '../../index'
import { DecisionTj, UnIdentifiedDecisionTj } from 'dbsder-api-types'
import { LogsFormat } from '../../../../shared/infrastructure/utils/logsFormat.utils'

export class DbSderApiGateway {
  async getDecisionBySourceId(sourceId: number) {
    type Response = {
      decisions: (Omit<DecisionTj, '_id'> & { _id: string })[]
      totalDecisions: number
      nextPage?: string
      previousPage?: string
    }

    const urlToCall = process.env.DBSDER_API_URL + '/decisions'

    const result = await axios
      .get<Response>(urlToCall, {
        params: { sourceName: 'juritj', sourceId: `${sourceId}` },
        headers: {
          'x-api-key': process.env.DBSDER_API_KEY
        }
      })
      .catch((error) => {
        const formatLogs: LogsFormat = {
          ...normalizationFormatLogs,
          operationName: 'getDecisionBySourceId',
          msg: 'Error while calling DbSder API'
        }
        if (error.response) {
          if (error.response.data.statusCode === HttpStatus.BAD_REQUEST) {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.BAD_REQUEST
            })
            throw new BadRequestException(
              'DbSderAPI Bad request error : ' + error.response.data.message
            )
          } else if (error.response.data.statusCode === HttpStatus.UNAUTHORIZED) {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.UNAUTHORIZED
            })

            throw new UnauthorizedException('You are not authorized to call this route')
          } else if (error.response.data.statusCode === HttpStatus.CONFLICT) {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.CONFLICT
            })
            throw new ConflictException('DbSderAPI error: ' + error.response.data.message)
          } else {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.SERVICE_UNAVAILABLE
            })
          }
        }
        throw new ServiceUnavailableException('DbSder API is unavailable')
      })

    if (result && Array.isArray(result.data.decisions) && result.data.decisions.length > 0) {
      return result.data.decisions[0]
    } else {
      return null
    }
  }

  async patchDecision(id: string, decisionToSave: UnIdentifiedDecisionTj) {
    const urlToCall = process.env.DBSDER_API_URL + `/decisions/${id}`

    const result = await axios
      .patch(urlToCall, decisionToSave, {
        headers: {
          'x-api-key': process.env.DBSDER_API_KEY
        }
      })
      .catch((error) => {
        const formatLogs: LogsFormat = {
          ...normalizationFormatLogs,
          operationName: 'patchDecision',
          msg: 'Error while calling DbSder API'
        }
        if (error.response) {
          if (error.response.data.statusCode === HttpStatus.BAD_REQUEST) {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.BAD_REQUEST
            })
            throw new BadRequestException(
              'DbSderAPI Bad request error : ' + error.response.data.message
            )
          } else if (error.response.data.statusCode === HttpStatus.UNAUTHORIZED) {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.UNAUTHORIZED
            })

            throw new UnauthorizedException('You are not authorized to call this route')
          } else if (error.response.data.statusCode === HttpStatus.CONFLICT) {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.CONFLICT
            })
            throw new ConflictException('DbSderAPI error: ' + error.response.data.message)
          } else {
            logger.error({
              ...formatLogs,
              msg: error.response.data.message,
              data: error.response.data,
              statusCode: HttpStatus.SERVICE_UNAVAILABLE
            })
          }
        }
        throw new ServiceUnavailableException('DbSder API is unavailable')
      })

    return result.data
  }
}
