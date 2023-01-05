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
    collection
      .create(metadonnees)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((ans) => {
        console.log('Document inserted')
        isInserted = true
      })
      .catch((err) => {
        console.log(err.Message)
        throw new ServiceUnavailableException(err.Message)
      })
    return isInserted
  }
}
