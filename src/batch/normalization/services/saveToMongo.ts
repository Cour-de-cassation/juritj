import { Decisions } from '../../../shared/domain/decisions'
import { DecisionMongoRepository } from '../repositories/decisionMongo.repository'

const decisionMongoRepository = new DecisionMongoRepository()

export async function saveDecisionToMongo(decision: Decisions) {
  await decisionMongoRepository.saveDecision(decision)
}
