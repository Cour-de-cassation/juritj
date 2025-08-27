import { UnIdentifiedDecision } from 'dbsder-api-types'
import axios, { AxiosError } from 'axios'
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import { logger } from '../../index'

export async function postDecisionToNormalisation(decision: UnIdentifiedDecision) {
  try {
    const result = await axios.post(
      `${process.env.JURINORM_API_URL}/normalize`,
      { decision },
      {
        headers: {
          'x-api-key': process.env.JURINORM_API_KEY
        }
      }
    )

    logger.info({
      operationName: 'sendToJurinorm',
      msg: 'Decision sent successfully to Jurinorm'
    })

    return result
  } catch (error) {
    if (error.response) {
      if (error.response.data.statusCode === HttpStatus.BAD_REQUEST) {
        logger.error({
          operationName: 'sendToJurinorm',
          msg: error.response.data.message,
          data: error.response.data,
          statusCode: HttpStatus.BAD_REQUEST
        })
        throw new BadRequestException('Jurinorm Bad request error : ' + error.response.data.message)
      } else if (error.response.data.statusCode === HttpStatus.UNAUTHORIZED) {
        logger.error({
          operationName: 'sendToJurinorm',
          msg: error.response.data.message,
          data: error.response.data,
          statusCode: HttpStatus.UNAUTHORIZED
        })

        throw new UnauthorizedException('You are not authorized to call this route')
      } else if (error.response.data.statusCode === HttpStatus.CONFLICT) {
        logger.error({
          operationName: 'sendToJurinorm',
          msg: error.response.data.message,
          data: error.response.data,
          statusCode: HttpStatus.CONFLICT
        })
        throw new ConflictException('Jurinorm error: ' + error.response.data.message)
      } else {
        logger.error({
          operationName: 'sendToJurinorm',
          msg: error.response.data.message,
          data: error.response.data,
          statusCode: HttpStatus.SERVICE_UNAVAILABLE
        })
      }
    }
    throw new ServiceUnavailableException('Jurinorm API is unavailable')
  }
}
