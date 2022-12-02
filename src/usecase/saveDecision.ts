import { DecisionRepository } from 'src/domain/decisions/repositories/decision.repository'

export class SaveDecisionUsecase {
  constructor(private decisionsRepository: DecisionRepository) {}

  async execute(requestInFile: string, decisionIntegreName: string) {
    await this.decisionsRepository.saveDecision(requestInFile, decisionIntegreName)
  }
}
