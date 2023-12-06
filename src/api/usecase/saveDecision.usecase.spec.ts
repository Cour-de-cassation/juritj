import { Readable } from 'stream'
import { MockProxy, mock } from 'jest-mock-extended'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { SaveDecisionUsecase } from './saveDecision.usecase'
import { DecisionRepository } from '../domain/decisions/repositories/decision.repository'

const fakeFilename = 'test'
jest.mock('uuid', () => ({ v4: () => fakeFilename }))

describe('SaveDecision Usecase', () => {
  const mockDecisionRepository: MockProxy<DecisionRepository> = mock<DecisionRepository>()
  const usecase = new SaveDecisionUsecase(mockDecisionRepository)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls the repository with valid parameters', async () => {
    // GIVEN
    const originalName = 'test.wpd'
    const generatedFilename = fakeFilename + '.json'
    const stream = new Readable()
    const decisionIntegre: Express.Multer.File = {
      fieldname: '',
      originalname: originalName,
      encoding: '',
      mimetype: '',
      size: 0,
      stream,
      destination: '',
      filename: originalName,
      path: '',
      buffer: Buffer.from('text')
    }
    const metadonnees = new MockUtils().mandatoryMetadonneesDtoMock

    /* Comment avoir un expected lisible et plus simple ?
     * Nous avons tenté en vain l'utilisation de deepMock (jest-extended) sur decisionIntegre pour
     * fournir un Express.Multer.File et sur metadonnees pour un MetadonneesDto simplfiés.
     */
    const expectedRequestDto = JSON.stringify({
      decisionIntegre: {
        fieldname: '',
        originalname: originalName,
        encoding: '',
        mimetype: '',
        size: 0,
        stream,
        destination: '',
        filename: originalName,
        path: '',
        buffer: { type: 'Buffer', data: [116, 101, 120, 116] }
      },
      metadonnees
    })

    // WHEN
    usecase.execute(decisionIntegre, metadonnees)

    // THEN
    expect(mockDecisionRepository.saveDecisionIntegre).toHaveBeenCalledWith(
      expectedRequestDto,
      generatedFilename
    )
  })
})
