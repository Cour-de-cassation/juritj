import mongoose, { Mongoose } from 'mongoose'
import { getEnvironment } from '../utils/env.utils'

export class DecisionMongoRepository {
  private mongoClient: Mongoose

  async saveDecision() {
    this.mongoClient = await mongoose.connect(getEnvironment('MONGODB_URL'))

    console.log(this.mongoClient.models)
  }
}
