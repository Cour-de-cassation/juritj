import {
  BadRequestException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import axios from 'axios'
import { DecisionDTO } from '../../infrastructure/decision.label.dto'
import { logger } from '../..'

export class DbSderApiGateway {
  async saveDecision(decisionToSave: DecisionDTO) {

console.log({DBSDER_API: process.env.DBSDER_API_URL})

    const result = await axios
      .post(
        process.env.DBSDER_API_URL + '/v1/decisions',
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
          }
        } else {
          console.log({error})
          throw new ServiceUnavailableException('DbSder API is unavailable')
        }
      })

    return result
  }
}
