export interface DecisionRepository {
  saveDecisionIntegre(decisionIntegre: string, filename?: string): Promise<void>
  saveDecisionNormalisee(decisionIntegre: string, filename?: string): Promise<void>
}
