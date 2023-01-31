import { Metadonnees } from '../../../shared/domain/metadonnees'
import { DecisionMongoRepository } from '../repositories/decisionMongo.repository'

const decisionMongoRepository = new DecisionMongoRepository()

export async function saveMetadonneesInDatabase(metadonnees: Metadonnees) {
  await decisionMongoRepository.saveDecision(metadonnees)
}
