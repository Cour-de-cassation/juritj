import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { S3_URL, S3_ACCESS_KEY, S3_SECRET_KEY, S3_REGION, S3_BUCKET_NAME_RAW } from '../config/env'
import { logger } from '../config/logger'
import { InfrastructureError } from '../services/error'

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      endpoint: S3_URL,
      forcePathStyle: true,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY
      }
    })
  }
  return s3Client
}

export function setS3Client(client: S3Client): void {
  s3Client = client
}

export async function saveDecisionFile(file: Express.Multer.File): Promise<void> {
  const client = getS3Client()

  const reqParams = new PutObjectCommand({
    Body: file.buffer,
    Bucket: S3_BUCKET_NAME_RAW,
    Key: file.originalname,
    ContentType: file.mimetype
  })

  try {
    await client.send(reqParams)
  } catch (error) {
    logger.error({
      operations: ['collect', 'decision'],
      path: 'src/connectors/s3.ts',
      message: JSON.stringify({ msg: error.message, data: error })
    })
    throw new InfrastructureError(error.message)
  }
}

export async function checkBucketHealth(): Promise<boolean> {
  const client = getS3Client()

  try {
    await client.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME_RAW,
        MaxKeys: 1
      })
    )
    return true
  } catch (error) {
    logger.error({
      operations: ['other', 'healthCheck'],
      path: 'src/connectors/s3.ts',
      message: JSON.stringify({ msg: error.message, data: error })
    })
    return false
  }
}
