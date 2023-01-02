export function removeUnnecessaryCharacters(rawString: string): string {
  const tabOrPageBreakRegex = /\t|\f/gi
  const stringWithoutTabOrPageBreak = rawString.replace(tabOrPageBreakRegex, '')

  const carriageReturnRegex = /\r\n|\r/gi
  const stringWithoutCarriageReturn = stringWithoutTabOrPageBreak.replace(carriageReturnRegex, '\n')

  const multipleSpaceRegex = /[ ]{2,}/gi
  return stringWithoutCarriageReturn.replace(multipleSpaceRegex, ' ')
}
