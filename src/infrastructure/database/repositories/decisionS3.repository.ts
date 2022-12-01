import { S3 } from '@aws-sdk/client-s3'
import { ServiceUnavailableException } from '@nestjs/common'
import { DecisionRepository } from '../../../domain/decisions/repositories/decision.repository'
import { SetupS3 } from '../../../infrastructure/database/setupS3'
import { CustomLogger } from '../../../infrastructure/utils/log.utils'

export class DecisionS3Repository implements DecisionRepository {
  private s3ApiClient: S3

  private logger = new CustomLogger()

  async saveDecision(decision: Express.Multer.File) {
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')

    // TODO mock this VV
    this.s3ApiClient = new SetupS3().getApiClient()

    const reqParams = {
      Body: decision.buffer,
      Bucket: process.env.SCW_BUCKET_NAME,
      Key: new Date().toISOString() + decision.originalname
    }

    await this.s3ApiClient.putObject(reqParams, (err, data) => {
      if (err) {
        this.logger.error(err + err.stack)
        throw new ServiceUnavailableException('Error from S3 API')
      } else {
        this.logger.log('S3 called successfully')
      }
    })
  }
}
