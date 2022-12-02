import { Request } from 'express'
import { DecisionRepository } from 'src/domain/decisions/repositories/decision.repository'

export class SaveDecisionUsecase {
  constructor(private decisionsRepository: DecisionRepository) {}
  async execute(request: Request, decisionIntegre: Express.Multer.File) {
    console.log({ request, decisionIntegre })
    await this.decisionsRepository.saveDecision(request, decisionIntegre)
  }
}
