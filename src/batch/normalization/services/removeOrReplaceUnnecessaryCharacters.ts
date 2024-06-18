import { characterReplacementMap } from '../infrastructure/characterReplacementMap'

export const replaceUnknownCharacters = (text: string) => {
  let replacedText = ''
  for (const character of text) {
    if (characterReplacementMap[character] == undefined) {
      replacedText += character
    } else {
      replacedText += characterReplacementMap[character]
    }
  }
  return replacedText
}

export const removeOrReplaceUnnecessaryCharacters = (rawString: string): string => {
  // Regular expressions to remove specific characters
  const tabOrPageBreakRegex = /\t|\f/gi
  const carriageReturnRegex = /\r\n|\r/gi
  const multipleSpaceRegex = /[ ]{2,}/gi

  // Replace tab or pageBreak characters with an empty string
  const stringWithoutTabOrPageBreak = rawString.replace(tabOrPageBreakRegex, ' ')

  // Replace carriageReturn characters with a newline character
  const stringWithoutCarriageReturn = stringWithoutTabOrPageBreak.replace(carriageReturnRegex, '\n')

  // Replace multiple consecutive spaces with a white space
  const stringWithoutConsecutiveSpaces = stringWithoutCarriageReturn.replace(
    multipleSpaceRegex,
    ' '
  )

  //replace tibetain characters
  const normalizedText = replaceUnknownCharacters(stringWithoutConsecutiveSpaces)

  return normalizedText
}
