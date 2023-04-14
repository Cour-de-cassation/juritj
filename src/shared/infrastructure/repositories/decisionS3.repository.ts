import { S3 } from '@aws-sdk/client-s3'
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
    try {
      await this.s3ApiClient.putObject(reqParams)
      this.logger.log('S3 called successfully')
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }

    // Mis en commentaire pour l'instant, est-ce nécessaire de garder ce niveau de détails dans les logs

    // this.logger.log(
    //   result.httpRequest.method + ' ' + result.httpRequest.endpoint.href + result.httpRequest.path
    // )
  }

  async deleteDecision(filename: string, bucketName: string): Promise<void> {
    try {
      const reqParams = {
        Bucket: bucketName,
        Key: filename
      }

      await this.s3ApiClient.deleteObject(reqParams)
      this.logger.log('S3 called successfully')
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }

  async getDecisionByFilename(filename: string): Promise<CollectDto> {
    try {
      const reqParams = {
        Bucket: process.env.S3_BUCKET_NAME_RAW,
        Key: filename
      }

      const decisionFromS3 = await this.s3ApiClient.getObject(reqParams)

      return JSON.parse(decisionFromS3.Body.toString())
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
      const decisionListFromS3 = await this.s3ApiClient.listObjectsV2(reqParams)

      return decisionListFromS3.Contents
    } catch (error) {
      this.logger.error(error + error.stack)
      throw new ServiceUnavailableException('Error from S3 API')
    }
  }
}
