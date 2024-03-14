import { characterReplacementMap } from "../infrastructure/characterReplacementMap";

export const removeOrReplaceUnnecessaryCharacters = (rawString: string): string => {
  
  // Regular expressions to remove specific characters
  const tabOrPageBreakRegex = /\t|\f/gi; 
  const carriageReturnRegex = /\r\n|\r/gi;
  const multipleSpaceRegex = /[ ]{2,}/gi;

  // Replace tab or pageBreak characters with an empty string
  const stringWithoutTabOrPageBreak = rawString.replace(tabOrPageBreakRegex, '');

  // Replace carriageReturn characters with a newline character
  let stringWithoutCarriageReturn = stringWithoutTabOrPageBreak.replace(carriageReturnRegex, '\n');

  // Replace multiple consecutive spaces with a white space
  stringWithoutCarriageReturn = stringWithoutCarriageReturn.replace(multipleSpaceRegex, ' ');

  //replace tibetain characters
  stringWithoutCarriageReturn = characterReplacementMap(stringWithoutCarriageReturn);

  return stringWithoutCarriageReturn;
}
