export interface DecisionRepository {
  saveDecisionIntegre(decisionIntegre: string, filename?: string): Promise<void>
}
