import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import {
  DecisionModel,
  DecisionSchema
} from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { logger } from '../index'

export class DecisionMongoRepository {
  private mongoClient: Mongoose

  async saveDecision(decision: DecisionModel): Promise<DecisionModel> {
    this.mongoClient = await mongoose.connect(process.env.MONGODB_URL)

    const collections = this.mongoClient.model('decisions', DecisionSchema)

    return this.insertMetadonnees(collections, decision).catch(() => {
      throw new ServiceUnavailableException('Error from database')
    })
  }

  async insertMetadonnees(collection, metadonnees: DecisionModel): Promise<DecisionModel> {
    return collection.create(metadonnees).catch((error) => {
      logger.error(error)
      throw new ServiceUnavailableException('Error from database')
    })
  }
}
