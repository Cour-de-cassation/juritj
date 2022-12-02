import { Request } from 'express'

export interface DecisionRepository {
  saveDecision(request: Request, decisionIntegre: Express.Multer.File) // TODO : ajouter le type du retour
}
