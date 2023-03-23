import { Readable } from 'stream'
import { MockProxy, mock } from 'jest-mock-extended'
import { MockUtils } from '../../shared/infrastructure/utils/mock.utils'
import { SaveDecisionUsecase } from './saveDecision.usecase'
import { DecisionRepository } from '../domain/decisions/repositories/decision.repository'

describe('SaveDecisionUsecase', () => {
  const mockDecisionRepository: MockProxy<DecisionRepository> = mock<DecisionRepository>()
  const usecase = new SaveDecisionUsecase(mockDecisionRepository)

  it('calls the repository with valid parameters', async () => {
    // GIVEN
    const fileName = 'test.wpd'
    const decisionIntegre: Express.Multer.File = {
      fieldname: '',
      originalname: fileName,
      encoding: '',
      mimetype: '',
      size: 0,
      stream: new Readable(),
      destination: '',
      filename: fileName,
      path: '',
      buffer: Buffer.from('text')
    }
    const metadonnees = new MockUtils().metadonneesDtoMock

    /* Comment avoir un expected lisible et plus simple ?
     * Nous avons tenté en vain l'utilisation de deepMock (jest-extended) sur decisionIntegre pour
     * fournir un Express.Multer.File et sur metadonnees pour un MetadonneesDto simplfiés.
     */
    const expectedRequestDto =
      '{"decisionIntegre":{"fieldname":"","originalname":"test.wpd","encoding":"","mimetype":"","size":0,"stream":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":[],"flowing":null,"ended":false,"endEmitted":false,"reading":false,"constructed":true,"sync":true,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"errorEmitted":false,"emitClose":true,"autoDestroy":true,"destroyed":false,"errored":null,"closed":false,"closeEmitted":false,"defaultEncoding":"utf8","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"dataEmitted":false,"decoder":null,"encoding":null},"_events":{},"_eventsCount":0},"destination":"","filename":"test.wpd","path":"","buffer":{"type":"Buffer","data":[116,101,120,116]}},"metadonnees":{"idDecision":"TJ75011A01/1234520221121","nomJuridiction":"Juridictions civiles de première instance","idJuridiction":"TJ75011","numeroRegistre":"A","numeroRoleGeneral":"01/12345","numeroMesureInstruction":["0123456789"],"codeService":"0A","dateDecision":"20221121","libelleService":"Libelle de service","codeDecision":"0aA","libelleCodeDecision":"some libelle code decision","decisionAssociee":{"numeroRegistre":"A","numeroRoleGeneral":"01/12345","idJuridiction":"TJ00000","date":"20221121","numeroMesureInstruction":"BCDEFGHIJK"},"parties":[{"type":"PP","nom":"nom Partie"},{"type":"PP","nom":"nom Partie"}],"codeNAC":"88F","libelleNAC":"Demande en dommages-intérêts contre un organisme","codeNature":"6C","libelleNature":"Autres demandes en matière de frais et dépens","public":false,"recommandationOccultation":false,"labelStatus":"toBeTreated"}}'

    // WHEN
    usecase.execute(decisionIntegre, metadonnees)

    // THEN
    expect(mockDecisionRepository.saveDecisionIntegre).toBeCalledWith(expectedRequestDto, fileName)
  })
})
