import { BadRequestException } from '@nestjs/common'
import { StringToJsonPipe } from './stringToJson.pipe'

describe('convert a string to json', () => {
  const target = new StringToJsonPipe()

  it('throws an error when the string is not converted to a json', () => {
    // GIVEN
    const incorrectJson = 'something'

    // WHEN
    expect(() => target.transform(incorrectJson))
      // THEN
      .toThrow(BadRequestException)
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
