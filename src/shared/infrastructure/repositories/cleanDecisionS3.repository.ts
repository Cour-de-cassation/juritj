import { DecisionRepository } from '../../../api/domain/decisions/repositories/decision.repository'
import { CollectDto } from '../dto/collect.dto'

export class CleanDecisionS3Repository implements DecisionRepository {
  static saveDecision(mockDecision: CollectDto): any {
    return 'OK'
  }

  async saveDecisionIntegre(requestToS3Dto: string, filename: string) {
    await console.log('something')
  }

  async saveDecisionNormalisee(requestToS3Dto: string, filename: string) {
    await console.log('something')
  }
}
