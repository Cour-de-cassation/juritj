import { DecisionS3Repository } from '../../../infrastructure/database/repositories/decisionS3.repository'

export class DecisionService {
  private repository = new DecisionS3Repository()
  async saveDecision(decision: any) {
    const response = await this.repository.saveDecision(decision)
    console.log({ response })
  }
}
