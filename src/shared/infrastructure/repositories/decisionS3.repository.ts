import * as S3 from 'aws-sdk/clients/s3'
import { v4 as uuidv4 } from 'uuid'
import { ServiceUnavailableException, Logger } from '@nestjs/common'
import { DecisionRepository } from '../../../api/domain/decisions/repositories/decision.repository'
import { CollectDto } from '../dto/collect.dto'

export class DecisionS3Repository implements DecisionRepository {
  private s3ApiClient: S3
  private readonly logger = new Logger()

  constructor(providedS3Client?: S3) {
    if (providedS3Client) {
      this.s3ApiClient = providedS3Client
    } else {
      this.s3ApiClient = new S3({
        endpoint: process.env.S3_URL,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY
        }
      })
    }
  }

  async saveDecisionIntegre(requestToS3Dto: string, filename: string) {
    const reqParams = {
      Body: requestToS3Dto,
      Bucket: process.env.S3_BUCKET_NAME_RAW,
      Key: uuidv4() + '-' + filename
    }

    await this.saveDecision(reqParams)
  }

  async saveDecisionNormalisee(requestToS3Dto: string, filename: string) {
    const reqParams = {
      Body: requestToS3Dto,
      Bucket: process.env.S3_BUCKET_NAME_NORMALIZED,
      Key: filename
    }
    await this.saveDecision(reqParams)
  }

  async saveDecision(reqParams): Promise<void> {
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

  async deleteDecision(filename: string, bucketName: string): Promise<void> {
    const reqParams = {
      Bucket: bucketName,
      Key: filename
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await this.s3ApiClient.deleteObject(reqParams, (err, data) => {
      if (err) {
        this.logger.error(err + err.stack)
        throw new ServiceUnavailableException('Error from S3 API')
      } else {
        this.logger.log('S3 called successfully')
      }
    })
  }

  async getDecisionByFilename(filename: string): Promise<CollectDto> {
    try {
      const reqParams = {
        Bucket: process.env.S3_BUCKET_NAME_RAW,
        Key: filename
      }

      const dataFromS3 = await this.s3ApiClient.getObject(reqParams)

      const decision = await dataFromS3.promise().then((data) => {
        return data.Body
      })

      return JSON.parse(decision.toString())
    } catch (e) {
      this.logger.error(e + e.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }

  async getDecisionList(): Promise<any> {
    try {
      const reqParams = {
        Bucket: process.env.S3_BUCKET_NAME_RAW
      }
      const dataFromS3 = await this.s3ApiClient.listObjectsV2(reqParams)
      const decisionList = await dataFromS3
        .promise()
        .then((data) => {
          return data.Contents
        })
        .catch((error) => {
          this.logger.error(error + error.stack)
          throw new ServiceUnavailableException('Error from S3 API')
        })

      return decisionList
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }
}
