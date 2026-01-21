import {
  DecisionRepository,
  RawFilesRepository
} from '../domain/decisions/repositories/decision.repository'
import { v4 as uuidv4 } from 'uuid'
import { MetadonneesDto } from '../../shared/infrastructure/dto/metadonnees.dto'

export class SaveDecisionUsecase {
  constructor(
    private decisionsRepository: DecisionRepository,
    private rawFilesRepository: RawFilesRepository
  ) {}

  /**
   * Pour le SaveDecisionUseCase, nous choisissons de déroger à une règle fondamentale de la Clean Archi :
   * le Use Case va s'appuyer des éléments de l'infrastructure (metadonneeesDto et Express.Multer.file).
   * Nous faisons ce choix pour les raisons suivantes :
   * - A date, nous pensons que la taille de l'API (relativement petite) ne nécessite pas
   * de la complexifier avec des interfaces ou des entities du domaine
   *
   * - Le fichier de décision intègre est un élément central de l'API JuriTJ Collect, nous serons donc
   * fortement attentifs à toute évolution de cette librairie
   *
   * En cas d'évolution du contexte, nous créerons les interfaces et entities du domaine
   */
  async execute(
    decisionIntegre: Express.Multer.File,
    metadonnees: MetadonneesDto
  ): Promise<string> {
    const wpdFileExtension = '.wpd'
    const decisionFileName = uuidv4() + wpdFileExtension

    // On ne sait pas quel est l'utilisation de la réponse par les utilisateurs
    // on conserve donc pour l'instant la réponse "historique" en .json
    const fileNameToReturn = decisionFileName.replace('.wpd', '.json')

    decisionIntegre.originalname = decisionFileName

    await this.decisionsRepository.saveDecisionIntegre(decisionIntegre)
    await this.rawFilesRepository.createFileInformation({
      path: decisionFileName,
      events: [{ status: 'created', date: new Date() }],
      metadatas: metadonnees
    })
    return fileNameToReturn
  }
}
