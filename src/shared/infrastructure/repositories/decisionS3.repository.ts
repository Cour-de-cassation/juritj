import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput
} from '@aws-sdk/client-s3'
import { LoggerService, ServiceUnavailableException } from '@nestjs/common'
import { DecisionRepository } from '../../../api/domain/decisions/repositories/decision.repository'
import { CollectDto } from '../dto/collect.dto'

export class DecisionS3Repository implements DecisionRepository {
  private s3Client: S3Client
  private logger

  constructor(logger: LoggerService, providedS3Client?: S3Client) {
    if (providedS3Client) {
      this.s3Client = providedS3Client
    } else {
      this.s3Client = new S3Client({
        endpoint: process.env.S3_URL,
        forcePathStyle: true,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY
        }
      })
    }
    this.logger = logger
  }

  async saveDecisionIntegre(requestToS3Dto: string, filename: string) {
    const reqParams = {
      Body: requestToS3Dto,
      Bucket: process.env.S3_BUCKET_NAME_RAW,
      Key: filename
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
    try {
      await this.s3Client.send(new PutObjectCommand(reqParams))
      this.logger.log('S3 called successfully')
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }

  async deleteDecision(filename: string, bucketName: string): Promise<void> {
    const reqParams = {
      Bucket: bucketName,
      Key: filename
    }

    try {
      await this.s3Client.send(new DeleteObjectCommand(reqParams))
      this.logger.log('S3 called successfully')
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }

  async getDecisionByFilename(filename: string): Promise<CollectDto> {
    const reqParams = {
      Bucket: process.env.S3_BUCKET_NAME_RAW,
      Key: filename
    }

    try {
      const decisionFromS3 = await this.s3Client.send(new GetObjectCommand(reqParams))
      const stringifiedDecision = await decisionFromS3.Body?.transformToString()
      return JSON.parse(stringifiedDecision)
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }

  async getDecisionList(maxNumberOfDecisionsToRetrieve?): Promise<any> {
    const reqParams: ListObjectsV2CommandInput = {
      Bucket: process.env.S3_BUCKET_NAME_RAW
    }
    if (maxNumberOfDecisionsToRetrieve >= 1 && maxNumberOfDecisionsToRetrieve <= 1000) {
      reqParams.MaxKeys = maxNumberOfDecisionsToRetrieve
    }

    try {
      const decisionListFromS3 = await this.s3Client.send(new ListObjectsV2Command(reqParams))
      return decisionListFromS3.Contents ? decisionListFromS3.Contents : []
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }
}
