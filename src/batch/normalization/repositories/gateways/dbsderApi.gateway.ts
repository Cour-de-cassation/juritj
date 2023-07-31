import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import axios from 'axios'
import { logger } from '../../index'
import { DecisionDTO } from 'dbsder-api-types'

export class DbSderApiGateway {
  async saveDecision(decisionToSave: DecisionDTO) {
    const urlToCall = process.env.DBSDER_API_URL + '/v1/decisions'

    const result = await axios
      .post(
        urlToCall,
        { decision: decisionToSave },
        {
          headers: {
            'x-api-key': process.env.DBSDER_API_KEY
          }
        }
      )
      .catch((error) => {
        if (error.response) {
          if (error.response.data.statusCode === HttpStatus.BAD_REQUEST) {
            logger.error(error.response.data.message)
            throw new BadRequestException(
              'DbSderAPI Bad request error : ' + error.response.data.message
            )
          } else if (error.response.data.statusCode === HttpStatus.UNAUTHORIZED) {
            logger.error(error.response.data.message)
            throw new UnauthorizedException('You are not authorized to call this route')
          } else if (error.response.data.statusCode === HttpStatus.CONFLICT) {
            logger.error(error.response.data.message)
            throw new ConflictException('DbSderAPI error: ' + error.response.data.message)
          } else {
            logger.error(error.response.data.message)
          }
        }
        throw new ServiceUnavailableException('DbSder API is unavailable')
      })

    return result.data
  }
}
