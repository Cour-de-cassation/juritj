import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import { Metadonnees } from '../../../shared/domain/metadonnees'
import { MetadonneesSchema } from '../../../shared/infrastructure/repositories/decisionMongo.schema'
import { logger } from '../normalization'

export class DecisionMongoRepository {
  private mongoClient: Mongoose

  async saveDecision(metadonnees: Metadonnees): Promise<Metadonnees> {
    this.mongoClient = await mongoose.connect(process.env.MONGODB_URL)

    const collections = this.mongoClient.model('metadonnees', MetadonneesSchema)

    return this.insertMetadonnees(collections, metadonnees).catch(() => {
      throw new ServiceUnavailableException('Error from database')
    })
  }

  async insertMetadonnees(collection, metadonnees: Metadonnees): Promise<Metadonnees> {
    return collection.create(metadonnees).catch((error) => {
      logger.error(error)
      throw new ServiceUnavailableException('Error from database')
    })
  }
}
