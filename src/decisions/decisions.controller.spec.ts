import { Test, TestingModule } from '@nestjs/testing'
import { Readable } from 'stream'
import { DecisionsController } from './decisions.controller'

export interface CustomFile extends Blob {
  readonly lastModified: number
  readonly name: string
}
describe('DecisionsController', () => {
  let controller: DecisionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecisionsController]
    }).compile()

    controller = module.get<DecisionsController>(DecisionsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('collectDecisions', () => {
    it('should return status code 200 after sending the correct file', () => {
      // GIVEN
      const decisionFile: Express.Multer.File = {
        originalname: 'test.wpd',
        mimetype: 'text/csv',
        buffer: Buffer.from('string from decision'),
        fieldname: '',
        encoding: '',
        size: 1024,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: ''
      }
      // WHEN
      const response = controller.collectDecisions(decisionFile)

      // THEN
      expect(response).toEqual(200)
    })
  })
})
