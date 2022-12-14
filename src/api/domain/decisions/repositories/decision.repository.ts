export interface DecisionRepository {
  saveDecision(decisionIntegre: string, filename: string): Promise<void>
}
