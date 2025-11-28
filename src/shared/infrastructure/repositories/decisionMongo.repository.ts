import { Document, MongoClient, OptionalUnlessRequiredId, InferIdType, Db } from 'mongodb'
import { RawFilesRepository } from '../../../api/domain/decisions/repositories/decision.repository'

export class DecisionMongoRepository implements RawFilesRepository {
  private db: Promise<Db>

  constructor() {
    const client = new MongoClient(process.env.FILE_DB_URL)
    this.db = client.connect().then((_) => _.db())
  }

  async createFileInformation<T extends Document>(
    file: OptionalUnlessRequiredId<T>
  ): Promise<{ _id: InferIdType<T> } & typeof file> {
    const db = await this.db
    const { insertedId } = await db.collection<T>(process.env.S3_BUCKET_NAME_RAW).insertOne(file)
    return { _id: insertedId, ...file }
  }
}
