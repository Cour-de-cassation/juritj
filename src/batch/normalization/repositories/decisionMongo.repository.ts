import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import { Metadonnees } from '../../../shared/domain/metadonnees'
import { MetadonneesSchema } from '../../../shared/infrastructure/repositories/decisionMongo.schema'
import { CustomLogger } from '../../../shared/infrastructure/utils/customLogger.utils'

export class DecisionMongoRepository {
  private mongoClient: Mongoose
  private logger = new CustomLogger()

  async saveDecision(metadonnees: Metadonnees): Promise<Metadonnees> {
    this.mongoClient = await mongoose.connect(process.env.MONGODB_URL)

    const collections = this.mongoClient.model('metadonnees', MetadonneesSchema)

    return this.insertMetadonnees(collections, metadonnees).catch(() => {
      throw new ServiceUnavailableException('Error from database')
    })
  }

  async insertMetadonnees(collection, metadonnees: Metadonnees): Promise<Metadonnees> {
    return collection.create(metadonnees).catch((error) => {
      this.logger.error(error)
      throw new ServiceUnavailableException('Error from database')
    })
  }
}
