import { DecisionService } from '../services/decision.service'

export class saveDecisionUsecase {
  private decisionService = new DecisionService()
  async execute(decision: Express.Multer.File) {
    await this.decisionService.saveDecision(decision)
  }
}
