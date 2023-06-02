import { BadRequestException, HttpStatus, ServiceUnavailableException } from '@nestjs/common'
import axios from 'axios'
import { DecisionLabelDTO } from 'src/batch/normalization/domain/decision.label.dto'

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
        const errorContent = error.response.data
        if (errorContent.statusCode === HttpStatus.BAD_REQUEST) {
          throw new BadRequestException('DbSderAPI Bad request error : ' + errorContent.message)
        } else {
          throw new ServiceUnavailableException('DbSder API is unavailable')
        }
      })

    return result
  }
}
