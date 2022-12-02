import * as AWS from 'aws-sdk'

import { Request } from 'express'
import { ServiceUnavailableException } from '@nestjs/common'
import { CustomLogger } from '../utils/log.utils'

export class DecisionS3Repository {
  private s3ApiClient: AWS.S3

  private logger = new CustomLogger()

  async saveDecision(request: Request, decisionIntegre: Express.Multer.File) {
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
      Body: request,
      Bucket: process.env.SCW_BUCKET_NAME,
      Key: new Date().toISOString() + decisionIntegre.originalname
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
