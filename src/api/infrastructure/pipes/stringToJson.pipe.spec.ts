import { StringToJsonPipe } from './stringToJson.pipe'
import { BadFieldFormatException } from '../exceptions/badFieldFormat.exception'

describe('convert a string to json', () => {
  const target = new StringToJsonPipe()

  it('throws an error when the string is not converted to a json', () => {
    // GIVEN
    const incorrectJson = 'something'

    // WHEN
    expect(() => target.transform(incorrectJson))
      // THEN
      .toThrow(BadFieldFormatException)
  })

  it('returns a valid json', () => {
    // GIVEN
    const correctString = '{"juridictionName": "my title"}'
    const correctJson = { juridictionName: 'my title' }

    // WHEN
    const resultTransform = target.transform(correctString)

    // THEN
    expect(resultTransform).toEqual(correctJson)
  })
})
