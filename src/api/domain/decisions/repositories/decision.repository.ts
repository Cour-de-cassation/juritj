import { MetadonneesDto } from "src/shared/infrastructure/dto/metadonnees.dto"

export interface DecisionRepository {
  saveDecisionIntegre(decisionIntegre: string, filename?: string): Promise<void>
}

export interface RawFilesRepository {
  createFileInformation(file: { 
    path: string, 
    events: [{ status: "created", date: Date }], 
    metadonnees: MetadonneesDto 
  }): Promise<unknown>
}