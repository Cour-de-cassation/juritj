import * as AWS from 'aws-sdk'

import { ServiceUnavailableException } from '@nestjs/common'
import { CustomLogger } from '../utils/log.utils'
import { DecisionRepository } from 'src/domain/decisions/repositories/decision.repository'

export class DecisionS3Repository implements DecisionRepository {
  private s3ApiClient: AWS.S3

  private logger = new CustomLogger()

  async saveDecision(requestInFile: string, decisionIntegreName: string) {
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')
    console.log('inside real saveDecision')

    this.s3ApiClient = new AWS.S3({
      endpoint: process.env.SCW_S3_URL,
      region: process.env.SCW_S3_REGION,
      credentials: {
        accessKeyId: process.env.SCW_S3_ACCESS_KEY,
        secretAccessKey: process.env.SCW_S3_SECRET_KEY
      }
    })

    const reqParams = {
      Body: requestInFile,
      Bucket: process.env.SCW_BUCKET_NAME,
      Key: new Date().toISOString() + decisionIntegreName
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
