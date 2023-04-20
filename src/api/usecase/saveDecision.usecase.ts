import { DecisionRepository } from '../domain/decisions/repositories/decision.repository'
import { MetadonneesDto } from '../../shared/infrastructure/dto/metadonnees.dto'

export class SaveDecisionUsecase {
  constructor(private decisionsRepository: DecisionRepository) {}

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

  cleanFileName(filename: string): string {
    // Remove accents from filename
    filename = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, ' ')

    // Remove special characters and convert to lowercase
    filename = filename.replace(/[^a-zA-Z0-9 ._-]/g, '').toLowerCase()

    // Replace spaces with hyphens and remove multiple periods
    filename = filename.replace(/ +/g, '-').replace(/\.+/g, '.')

    // Remove leading/trailing hyphens and periods
    filename = filename.replace(/^[.-]+|[.-]+$/g, '')

    // Remove everything after the last period, except for ".wpd"
    const dotIndex = filename.lastIndexOf('.')
    if (dotIndex >= 0) {
      const extension = filename.slice(dotIndex)
      if (extension !== '.wpd') {
        filename = filename.slice(0, dotIndex).replace(/\./g, '') + extension
      }
    }

    // Remove remaining hyphens
    filename = filename.replace(/-/g, '')

    return filename
  }

  async execute(decisionIntegre: Express.Multer.File, metadonnees: MetadonneesDto): Promise<void> {
    const requestDto = {
      decisionIntegre,
      metadonnees
    }
    const filename = this.cleanFileName(decisionIntegre.originalname)

    await this.decisionsRepository.saveDecisionIntegre(JSON.stringify(requestDto), filename)
  }
}
