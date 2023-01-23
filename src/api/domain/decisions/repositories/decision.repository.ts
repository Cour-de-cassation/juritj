export interface DecisionRepository {
  saveRawDecision(decisionIntegre: string, filename?: string): Promise<void>
  saveNormalizedDecision(decisionIntegre: string, filename?: string): Promise<void>
}
