import { MetadonneesDto } from 'src/shared/infrastructure/dto/metadonnees.dto'

export interface DecisionRepository {
  saveDecisionIntegre(decisionIntegre: Express.Multer.File): Promise<void>
}

export interface RawFilesRepository {
  createFileInformation(file: {
    path: string
    events: [{ type: 'created'; date: Date }]
    metadatas: MetadonneesDto
  }): Promise<unknown>
}
