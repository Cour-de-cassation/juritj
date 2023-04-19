import { BadRequestException } from '@nestjs/common'
import { StringToJsonPipe } from './stringToJson.pipe'

describe('convert a string to json', () => {
  const target = new StringToJsonPipe()

  it('should throw an error if the string is not converted to a json', () => {
    // GIVEN
    const incorrectJson = 'something'

    // WHEN
    expect(() => target.transform(incorrectJson))
      // THEN
      .toThrow(BadRequestException)
  })

  it('should return a valid json', () => {
    // GIVEN
    const correctString = '{"juridictionName": "my title"}'
    const correctJson = { juridictionName: 'my title' }

    // WHEN
    const resultTransform = target.transform(correctString)

    // THEN
    expect(resultTransform).toEqual(correctJson)
  })
})
