export const removeOrReplaceUnnecessaryCharacters = (rawString: string): string => {
  
  // Regular expressions to remove specific characters
  const tabOrPageBreakRegex = /\t|\f/gi; 
  const carriageReturnRegex = /\r\n|\r/gi;
  const multipleSpaceRegex = /[ ]{2,}/gi;

  // Replace tab or pageBreak characters with an empty string
  let stringWithoutTabOrPageBreak = rawString.replace(tabOrPageBreakRegex, '');

  // Replace carriageReturn characters with a newline character
  let stringWithoutCarriageReturn = stringWithoutTabOrPageBreak.replace(carriageReturnRegex, '\n');

  // Replace multiple consecutive spaces with a white space
  stringWithoutCarriageReturn = stringWithoutCarriageReturn.replace(multipleSpaceRegex, ' ');

  // Define key-value to remove Tibetan characters
  const tibetanCharactersToRemove: { [key: string]: string } = {
    '4013': ' ',
    '64257': 'fi',
    '3844': 'É',
    '3845': '',
    '173': '',
    '768': '',
    '710': '',
    '900': '',
    '3874': 'À',
    '3943': "'",
    '769': '',
    '3942': '€',
    '3986': '',
    '4017': '',
    '3938': '-',
    '4018': '',
    '3881': 'Ç',
    '64256': 'ff',
    '4003': '',
    '4006': '',
    '3918': '-',
    '4009': '',
    '3905': '',
    '7922': '-',
    '3967': '',
    '3876': 'Â',
    '3853': 'Ê',
    '3940': '-',
    '3934': '«',
    '3931': ' »',
    '3924': '-'
};

  // Iterate to remplace tibetain characters
  for (const [tibetanCharacter, replacement] of Object.entries(tibetanCharactersToRemove)) {
    stringWithoutCarriageReturn = stringWithoutCarriageReturn.split(String.fromCharCode(parseInt(tibetanCharacter))).join(replacement);
  }

  return stringWithoutCarriageReturn;
}
