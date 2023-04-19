import { ValidateDtoPipe } from './validateDto.pipe'

describe('ValidateDTOPipe', () => {
  const pipe = new ValidateDtoPipe()

  describe('findPropertyInErrorMessage', () => {
    it('returns property dateDecision when the error message contains dateDecision', () => {
      // GIVEN
      const errorMessage =
        'An instance of MetadonneesDto has failed the validation:\n' +
        ' - property dateDecision has failed the following constraints: isDateString, matches, isString \n'

      // WHEN
      const result = pipe.findPropertyNameInErrorMessage(errorMessage)

      // THEN
      expect(result).toEqual('dateDecision')
    })

    it('returns an empty string when the error message is empty', () => {
      // GIVEN
      const errorMessage = ''

      // WHEN
      const result = pipe.findPropertyNameInErrorMessage(errorMessage)

      // THEN
      expect(result).toEqual('')
    })
  })
})
