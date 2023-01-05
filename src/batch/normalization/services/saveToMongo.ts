import { Metadonnees } from 'src/shared/domain/metadonnees'
import { DecisionMongoRepository } from '../../../shared/infrastructure/repositories/decisionMongo.repository'

const decisionMongoRepository = new DecisionMongoRepository()

export async function saveMetadonnees(metadonnees: Metadonnees) {
  await decisionMongoRepository.saveDecision(metadonnees)
}
