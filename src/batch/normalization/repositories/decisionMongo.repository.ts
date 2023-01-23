import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import { Decisions } from '../../../shared/domain/decisions'
import { DecisionSchema } from '../../../shared/infrastructure/repositories/decisionMongo.schema'
import { logger } from '../normalization'

export class DecisionMongoRepository {
  private mongoClient: Mongoose

  async saveDecision(decision: Decisions): Promise<Decisions> {
    this.mongoClient = await mongoose.connect(process.env.MONGODB_URL)

    const collections = this.mongoClient.model('decisions', DecisionSchema)

    return this.insertMetadonnees(collections, decision).catch(() => {
      throw new ServiceUnavailableException('Error from database')
    })
  }

  async insertMetadonnees(collection, metadonnees: Decisions): Promise<Decisions> {
    return collection.create(metadonnees).catch((error) => {
      logger.error(error)
      throw new ServiceUnavailableException('Error from database')
    })
  }
}
