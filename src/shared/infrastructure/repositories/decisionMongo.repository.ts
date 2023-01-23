import { ServiceUnavailableException } from '@nestjs/common'
import mongoose, { Mongoose } from 'mongoose'
import { MetadonneesDto } from '../dto/metadonnees.dto'
import { MetadonneesSchema } from './decisionMongo.schema'
import 'dotenv/config'
import { CustomLogger } from '../utils/customLogger.utils'

export class DecisionMongoRepository {
  private mongoClient: Mongoose
  private logger = new CustomLogger()

  async saveDecision(metadonnees: MetadonneesDto): Promise<boolean> {
    this.mongoClient = await mongoose.connect(process.env.MONGODB_URL)

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
      this.logger.log('inserted to Mongo', metadonnees.idDecision)
      isInserted = true
    } catch (e) {
      this.logger.error(e)
      throw new ServiceUnavailableException('Error from Mongo')
    }
    return isInserted
  }
}
