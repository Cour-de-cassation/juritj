import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import { MetadonneesDto } from '../dto/metadonnees.dto'
import { getEnvironment } from '../utils/env.utils'
import { MetadonneesSchema } from './decisionMongo.schema'

export class DecisionMongoRepository {
  private mongoClient: Mongoose

  async saveDecision(metadonnees: MetadonneesDto): Promise<boolean> {
    this.mongoClient = await mongoose.connect(getEnvironment('MONGODB_URL'))

    const collections = this.mongoClient.model('metadonnees', MetadonneesSchema)

    const isDecisionInserted = this.insertMetadonnees(collections, metadonnees)
    if (!isDecisionInserted) {
      throw new ServiceUnavailableException('Error from Mongo')
    }
    return isDecisionInserted
  }

  insertMetadonnees(collection, metadonnees: MetadonneesDto): boolean {
    let isInserted = false
    try {
      collection.create(metadonnees)
      isInserted = true
    } catch (e) {
      console.log(e)
      throw new ServiceUnavailableException('Error from Mongo')
    }
    return isInserted
  }
}
