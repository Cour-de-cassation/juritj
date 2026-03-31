import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  _Object
} from '@aws-sdk/client-s3'
import { S3_ACCESS_KEY, S3_BUCKET_NAME_RAW, S3_REGION, S3_SECRET_KEY, S3_URL } from '../config/env'
import { BucketError } from '../services/error'
import { logger } from '../config/logger'

const S3Options: S3ClientConfig = {
  endpoint: S3_URL,
  forcePathStyle: true,
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY
  }
}

const s3Client = new S3Client(S3Options)

export async function saveDecisionIntegre(decisionIntegre: Express.Multer.File): Promise<void> {
  const reqParams = new PutObjectCommand({
    Body: decisionIntegre.buffer,
    Bucket: S3_BUCKET_NAME_RAW,
    Key: decisionIntegre.originalname,
    ContentType: decisionIntegre.mimetype
  })

  try {
    await s3Client.send(reqParams)
  } catch (error) {
    logger.error({
      path: 'src/connectors/bucket.ts',
      operations: ['other', 'saveDecisionIntegre'],
      message: error.message,
      stack: error.stack
    })
    throw new BucketError(error)
  }
}

export async function deleteDecision(filename: string, bucketName: string): Promise<void> {
  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: filename }))
  } catch (error) {
    logger.error({
      path: 'src/connectors/bucket.ts',
      operations: ['other', 'deleteDecision'],
      message: error.message,
      stack: error.stack
    })
    throw new BucketError(error)
  }
}

export async function getDecisionByFilename(filename: string): Promise<unknown> {
  try {
    const decisionFromS3 = await s3Client.send(
      new GetObjectCommand({ Bucket: S3_BUCKET_NAME_RAW, Key: filename })
    )
    const stringifiedDecision = await decisionFromS3.Body?.transformToString()
    return JSON.parse(stringifiedDecision)
  } catch (error) {
    logger.error({
      path: 'src/connectors/bucket.ts',
      operations: ['other', 'getDecisionByFilename'],
      message: error.message,
      stack: error.stack
    })
    throw new BucketError(error)
  }
}

export async function getDecisionList(
  maxNumberOfDecisionsToRetrieve?: number,
  startAfterFileName?: string
): Promise<_Object[]> {
  const reqParams: ListObjectsV2CommandInput = {
    Bucket: S3_BUCKET_NAME_RAW
  }
  if (maxNumberOfDecisionsToRetrieve >= 1 && maxNumberOfDecisionsToRetrieve <= 1000) {
    reqParams.MaxKeys = maxNumberOfDecisionsToRetrieve
  }
  if (startAfterFileName) reqParams.StartAfter = startAfterFileName

  try {
    const decisionListFromS3 = await s3Client.send(new ListObjectsV2Command(reqParams))
    return decisionListFromS3.Contents ? decisionListFromS3.Contents : []
  } catch (error) {
    logger.error({
      path: 'src/connectors/bucket.ts',
      operations: ['other', 'getDecisionList'],
      message: error.message,
      stack: error.stack
    })
    throw new BucketError(error)
  }
}
