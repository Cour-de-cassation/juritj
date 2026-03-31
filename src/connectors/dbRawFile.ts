import { Document, MongoClient, OptionalUnlessRequiredId, InferIdType, Db } from 'mongodb'
import { FILE_DB_URL, S3_BUCKET_NAME_RAW } from '../config/env'

const client = new MongoClient(FILE_DB_URL)
const dbConnect: Promise<Db> = client.connect().then((_) => _.db())

export async function createFileInformation<T extends Document>(
  file: OptionalUnlessRequiredId<T>
): Promise<{ _id: InferIdType<T> } & typeof file> {
  const db = await dbConnect
  const { insertedId } = await db.collection<T>(S3_BUCKET_NAME_RAW).insertOne(file)
  return { _id: insertedId, ...file }
}

export async function checkDbConnection(): Promise<void> {
  const db = await dbConnect
  await db.command({ ping: 1 })
}
