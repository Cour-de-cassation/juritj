import * as S3 from 'aws-sdk/clients/s3'

import { ServiceUnavailableException } from '@nestjs/common'
import { CustomLogger } from '../utils/customLogger.utils'
import { DecisionRepository } from '../../../api/domain/decisions/repositories/decision.repository'
import { getEnvironment } from '../utils/env.utils'
import { CollectDto } from '../dto/collect.dto'
export class DecisionS3Repository implements DecisionRepository {
  private s3ApiClient: S3
  private logger = new CustomLogger()

  constructor(providedS3Client?: S3) {
    if (providedS3Client) {
      this.s3ApiClient = providedS3Client
    } else {
      this.s3ApiClient = new S3({
        endpoint: getEnvironment('SCW_S3_URL'),
        region: getEnvironment('SCW_S3_REGION'),
        credentials: {
          accessKeyId: getEnvironment('SCW_S3_ACCESS_KEY'),
          secretAccessKey: getEnvironment('SCW_S3_SECRET_KEY')
        }
      })
    }
  }

  async saveDecision(requestToS3Dto: string, filename: string): Promise<void> {
    const reqParams = {
      Body: requestToS3Dto,
      Bucket: getEnvironment('SCW_BUCKET_NAME'),
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

  async getDecisionByFilename(filename: string): Promise<CollectDto> {
    try {
      const reqParams = {
        Bucket: getEnvironment('SCW_BUCKET_NAME'),
        Key: filename
      }

      const data = await this.s3ApiClient.getObject(reqParams).promise()

      return JSON.parse(data.Body.toString())
    } catch (e) {
      this.logger.error(e + e.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }
}
