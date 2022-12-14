import * as S3 from 'aws-sdk/clients/s3'

import { ServiceUnavailableException } from '@nestjs/common'
import { CustomLogger } from '../../../shared/infrastructure/utils/customLogger.utils'
import { DecisionRepository } from '../../../api/domain/decisions/repositories/decision.repository'

export class DecisionS3Repository implements DecisionRepository {
  private s3ApiClient: S3
  private readonly logger = new CustomLogger()

  constructor(providedS3Client?: S3) {
    if (providedS3Client) {
      this.s3ApiClient = providedS3Client
    } else {
      this.s3ApiClient = new S3({
        endpoint: process.env.SCW_S3_URL,
        region: process.env.SCW_S3_REGION,
        credentials: {
          accessKeyId: process.env.SCW_S3_ACCESS_KEY,
          secretAccessKey: process.env.SCW_S3_SECRET_KEY
        }
      })
    }
  }

  async saveDecision(requestToS3Dto: string, filename: string): Promise<void> {
    const reqParams = {
      Body: requestToS3Dto,
      Bucket: process.env.SCW_BUCKET_NAME,
      Key: new Date().toISOString() + filename
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await this.s3ApiClient.putObject(reqParams, (err, data) => {
      if (err) {
        this.logger.error(err + err.stack)
        throw new ServiceUnavailableException('Error from S3 API')
      } else {
        this.logger.log('S3 called successfully')
      }
    })

    this.logger.log(
      result.httpRequest.method + ' ' + result.httpRequest.endpoint.href + result.httpRequest.path
    )
  }
}
