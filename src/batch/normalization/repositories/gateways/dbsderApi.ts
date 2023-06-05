import {
  BadRequestException,
  HttpStatus,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common'
import axios from 'axios'
import { DecisionLabelDTO } from 'src/batch/normalization/domain/decision.label.dto'
import { logger } from '../..'

export class DbSderApiGateway {
  async saveDecision(decisionToSave: DecisionLabelDTO) {
    const result = await axios
      .post(
        process.env.DBSDER_API_URL + '/decisions',
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
          throw new ServiceUnavailableException('DbSder API is unavailable')
        }
      })

    return result
  }
}
