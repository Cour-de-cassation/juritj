import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import { DecisionLabelDTO, DecisionSchema } from '../domain/decision.label.dto'
import { logger } from '../index'

export class DecisionMongoRepository {
  private mongoClient: Mongoose

  async saveDecision(decision: DecisionLabelDTO): Promise<DecisionLabelDTO> {
    this.mongoClient = await mongoose.connect(process.env.MONGODB_URL)
    const collections = this.mongoClient.model('decisions', DecisionSchema)

    return this.insertMetadonnees(collections, decision).catch(() => {
      throw new ServiceUnavailableException('Error from database')
    })
  }

  async insertMetadonnees(collection, metadonnees: DecisionLabelDTO): Promise<DecisionLabelDTO> {
    return collection.create(metadonnees).catch((error) => {
      logger.error(error)
      throw new ServiceUnavailableException('Error from database')
    })
  }
}
