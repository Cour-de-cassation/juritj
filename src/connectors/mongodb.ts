import { Document, MongoClient, OptionalUnlessRequiredId, InferIdType, Db } from 'mongodb'
import { FILE_DB_URL, S3_BUCKET_NAME_RAW } from '../config/env'

let dbPromise: Promise<Db> | null = null

function getDb(): Promise<Db> {
  if (!dbPromise) {
    const client = new MongoClient(FILE_DB_URL)
    dbPromise = client.connect().then((c) => c.db())
  }
  return dbPromise
}

export type FileInfo = {
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
