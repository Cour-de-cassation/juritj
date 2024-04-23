import { removeOrReplaceUnnecessaryCharacters } from './removeOrReplaceUnnecessaryCharacters'

describe('Remove unnecessary characters from decision', () => {
  it('replaces multiple return character \r to a newline character \n', () => {
    // GIVEN
    const rawString = 'A string with \r character \r'
    const trueString = 'A string with \n character \n'
    // WHEN
    const normalizedString = removeOrReplaceUnnecessaryCharacters(rawString)
    // THEN
    expect(normalizedString).toEqual(trueString)
  })

  it('replaces multiple \r\n to newline characters \n', () => {
    // GIVEN
    const rawString = 'A string with \r\n character \r\n'
    const trueString = 'A string with \n character \n'

    // WHEN
    const normalizedString = removeOrReplaceUnnecessaryCharacters(rawString)

    // THEN
    expect(normalizedString).toEqual(trueString)
  })

  it('replaces \r\n and \r in the same sentence to newline characters \n', () => {
    // GIVEN
    const rawString = 'A string with \r\n character \r'
    const trueString = 'A string with \n character \n'

    // WHEN
    const normalizedString = removeOrReplaceUnnecessaryCharacters(rawString)

    // THEN
    expect(normalizedString).toEqual(trueString)
  })

  it('deletes multiple tab character \t', () => {
    // GIVEN
    const rawString = 'A string with \t character \t'
    const trueString = 'A string with character '

    // WHEN
    const normalizedString = removeOrReplaceUnnecessaryCharacters(rawString)

    // THEN
    expect(normalizedString).toEqual(trueString)
  })

  it('deletes multiple form feed character \f', () => {
    // GIVEN
    const rawString = 'A string with \f character \f'
    const trueString = 'A string with character '

    // WHEN
    const normalizedString = removeOrReplaceUnnecessaryCharacters(rawString)

    // THEN
    expect(normalizedString).toEqual(trueString)
  })

  it('replaces multiple space characters with a single space character', () => {
    // GIVEN
    const rawString = 'A string      with   space character'
    const trueString = 'A string with space character'

    // WHEN
    const normalizedString = removeOrReplaceUnnecessaryCharacters(rawString)

    // THEN
    expect(normalizedString).toEqual(trueString)
  })

  it('replaces multiple tibetain characters with terms', () => {
    // GIVEN
    const rawString = "A string with ༄ and ༅  'ྒ string with tibetain characters."
    const trueString = "A string with É and  ' string with tibetain characters."

    // WHEN
    const normalizedString = removeOrReplaceUnnecessaryCharacters(rawString)

    // THEN
    expect(normalizedString).toEqual(trueString)
  })
})
