import { Readable } from 'stream'
import { isWordperfectFileType } from './decisions.controller'

describe('Decision Controller', () => {
  describe('isWordperfectFileType', () => {
    const file: Express.Multer.File = {
      buffer: Buffer.from('text'),
      destination: '',
      encoding: '',
      fieldname: '',
      filename: '',
      mimetype: '',
      originalname: 'example.wpd',
      path: '',
      size: 0,
      stream: new Readable()
    }

    it('returns false when the file does not have .wpd extension', () => {
      // GIVEN
      const wrongFile = { ...file, originalname: 'wrongFile.txt' }
      // WHEN
      const result = isWordperfectFileType(wrongFile)

      // THEN
      expect(result).toEqual(false)
    })

    it('returns false when the file does not have a valid wordperfect mimeType', () => {
      // GIVEN
      const wrongMimeTypeFile = {
        ...file,
        originalname: 'test.wpd',
        mimetype: 'application/json'
      }

      // WHEN
      const result = isWordperfectFileType(wrongMimeTypeFile)

      // THEN
      expect(result).toEqual(false)
    })

    it('returns true when the file is a wpd file and has the good mimetype', () => {
      // GIVEN
      const validFile = {
        ...file,
        originalname: 'test.wpd',
        mimetype: 'application/vnd.wordperfect'
      }
      const secondValidFile = {
        ...file,
        originalname: 'test.wpd',
        mimetype: 'application/wordperfect'
      }

      // WHEN
      const result = isWordperfectFileType(validFile)
      const secondResult = isWordperfectFileType(secondValidFile)

      // THEN
      expect(result).toEqual(true)
      expect(secondResult).toEqual(true)
    })
  })
})
