import { Document, MongoClient, OptionalUnlessRequiredId, InferIdType, Db } from 'mongodb'
import { FILE_DB_URL, S3_BUCKET_NAME_RAW } from '../config/env'
import { logger } from '../config/logger'

let dbPromise: Promise<Db> | null = null

function getDb(): Promise<Db> {
  if (!dbPromise) {
    const client = new MongoClient(FILE_DB_URL)
    dbPromise = client.connect().then((c) => c.db())
  }
  return dbPromise
}

export type RawFile = {
  path: string
  events: Array<{ type: string; date: Date }>
  metadatas: unknown
}

export async function saveFileMetadata<T extends Document>(
  file: OptionalUnlessRequiredId<T>
): Promise<{ _id: InferIdType<T> } & typeof file> {
  const db = await getDb()
  const { insertedId } = await db.collection<T>(S3_BUCKET_NAME_RAW).insertOne(file)
  return { _id: insertedId, ...file }
}

export async function checkDbHealth(): Promise<boolean> {
  try {
    const db = await getDb()
    await db.command({ ping: 1 })
    return true
  } catch (error) {
    logger.error({
      operations: ['other', 'healthCheck'],
      path: 'src/connectors/mongodb.ts',
      message: JSON.stringify({ msg: error.message, data: error })
    })
    return false
  }
}
