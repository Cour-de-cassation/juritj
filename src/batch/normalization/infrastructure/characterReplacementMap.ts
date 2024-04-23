const characterReplacementMapUnicode = {
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
}

export const characterReplacementMap = Object.keys(characterReplacementMapUnicode).reduce(
  (result, key) => {
    result[String.fromCharCode(parseInt(key))] = characterReplacementMapUnicode[key]
    return result
  },
  {}
)
