import { Readable } from 'stream'
import { MockProxy, mock } from 'jest-mock-extended'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { SaveDecisionUsecase } from './saveDecision.usecase'
import { DecisionRepository } from '../domain/decisions/repositories/decision.repository'

jest.mock('uuid', () => ({ v4: () => fakeFilename }))
const fakeFilename = 'test'
describe('SaveDecisionUsecase', () => {
  const mockDecisionRepository: MockProxy<DecisionRepository> = mock<DecisionRepository>()
  const usecase = new SaveDecisionUsecase(mockDecisionRepository)

  afterAll(() => {
    jest.clearAllMocks()
  })
  it('calls the repository with valid parameters', async () => {
    // GIVEN
    const fullFilename = fakeFilename + '.wpd'
    const decisionIntegre: Express.Multer.File = {
      fieldname: '',
      originalname: fullFilename,
      encoding: '',
      mimetype: '',
      size: 0,
      stream: new Readable(),
      destination: '',
      filename: fullFilename,
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
        originalname: 'test.wpd',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: {
          _readableState: {
            objectMode: false,
            highWaterMark: 16384,
            buffer: { head: null, tail: null, length: 0 },
            length: 0,
            pipes: [],
            flowing: null,
            ended: false,
            endEmitted: false,
            reading: false,
            constructed: true,
            sync: true,
            needReadable: false,
            emittedReadable: false,
            readableListening: false,
            resumeScheduled: false,
            errorEmitted: false,
            emitClose: true,
            autoDestroy: true,
            destroyed: false,
            errored: null,
            closed: false,
            closeEmitted: false,
            defaultEncoding: 'utf8',
            awaitDrainWriters: null,
            multiAwaitDrain: false,
            readingMore: false,
            dataEmitted: false,
            decoder: null,
            encoding: null
          },
          _events: {},
          _eventsCount: 0
        },
        destination: '',
        filename: 'test.wpd',
        path: '',
        buffer: { type: 'Buffer', data: [116, 101, 120, 116] }
      },
      metadonnees
    })

    // WHEN
    usecase.execute(decisionIntegre, metadonnees)

    // THEN
    expect(mockDecisionRepository.saveDecisionIntegre).toBeCalledWith(
      expectedRequestDto,
      fakeFilename + '.wpd'
    )
  })
})
