import { DecisionMongoRepository } from '../../../shared/infrastructure/repositories/decisionMongo.repository'

const decisionMongoRepository = new DecisionMongoRepository()

export async function saveDecision() {
  await decisionMongoRepository.saveDecision()
}
