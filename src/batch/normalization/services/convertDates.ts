export function replaceByNumericalMonth(dateWithLiteralMonth: string): string {
  const regexMonthList = [
    /janvier/gi,
    /février/gi,
    /mars/gi,
    /avril/gi,
    /mai/gi,
    /juin/gi,
    /juillet/gi,
    /août/gi,
    /septembre/gi,
    /octobre/gi,
    /novembre/gi,
    /décembre/gi
  ]
  const numericalMonthList = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
  ]

  regexMonthList.forEach((regexItem, listIndex) => {
    dateWithLiteralMonth = dateWithLiteralMonth.replace(regexItem, numericalMonthList[listIndex])
  })
  return dateWithLiteralMonth
}

export function normalizeDatesToIso8601(decision: string): string {
  const hyphenSeparator = '-'
  const slashSeparator = '/'

  const literalDateRegex = /[0-9]{1,2} [A-zÀ-ÿ]+ [0-9]{4}/gim // Exemple : 9 février 2022
  const decisionWithFormatedLiteralDates = decision.replace(literalDateRegex, (providedDate) => {
    const dateWithoutSpaces = providedDate.replace(/ /gm, hyphenSeparator)
    const numericalDateMatchString = replaceByNumericalMonth(dateWithoutSpaces)
    return convertDateStringToList(numericalDateMatchString, true, hyphenSeparator)
  })

  const yearInFirstPositionWithHyphenSeparatorRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/gim // Exemple : 2022-02-03
  const decisionWithFormatedYearInFirstPositionWithHyphenSeparator =
    decisionWithFormatedLiteralDates.replace(
      yearInFirstPositionWithHyphenSeparatorRegex,
      (providedDate) => convertDateStringToList(providedDate, false, hyphenSeparator)
    )

  const yearInLastPositionWithHyphenSeparatorRegex = /[0-9]{2}-[0-9]{2}-[0-9]{4}/gim // Exemple : 03-02-2022
  const decisionWithFormatedYearInLastPositionWithHyphenSeparator =
    decisionWithFormatedYearInFirstPositionWithHyphenSeparator.replace(
      yearInLastPositionWithHyphenSeparatorRegex,
      (providedDate) => convertDateStringToList(providedDate, false, hyphenSeparator)
    )

  const yearInFirstPositionWithSlashSeparatorRegex = /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/gim // Exemple : 2022/02/03
  const decisionWithFormatedYearInFirstPositionWithSlashSeparator =
    decisionWithFormatedYearInLastPositionWithHyphenSeparator.replace(
      yearInFirstPositionWithSlashSeparatorRegex,
      (providedDate) => convertDateStringToList(providedDate, false, slashSeparator)
    )

  const yearInLastPositioWithSlashSeparatorRegex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/gim // Exemple : 03/02/2022
  const decisionWithYearInLastPositioWithSlashSeparator =
    decisionWithFormatedYearInFirstPositionWithSlashSeparator.replace(
      yearInLastPositioWithSlashSeparatorRegex,
      (providedDate) => convertDateStringToList(providedDate, false, slashSeparator)
    )

  return decisionWithYearInLastPositioWithSlashSeparator
}

function convertDateStringToList(
  dateString: string,
  isLiteral: boolean,
  separator: string
): string {
  /**
   * Cas général : la date est aux formats 'DD-MM-YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY' ou 'YYYY/MM/DD'
   * Dans le cas où MM > 12 et DD < 12, on inverse DD et MM (cas des formats 'MM-DD-YYYY', 'YYYY-DD-MM', 'MM/DD/YYYY' ou 'YYYY/DD/MM')
   */
  const listDate: string[] = dateString.split(separator)

  if (isLiteral) {
    if (listDate[0].length === 1) {
      return listDate[2] + '-' + listDate[1] + '-0' + listDate[0]
    }
    return listDate[2] + '-' + listDate[1] + '-' + listDate[0]
  } else {
    const month: string = listDate[1]
    const year: string = listDate[0].length == 4 ? listDate[0] : listDate[2]

    listDate.splice(listDate.indexOf(month), 1)
    listDate.splice(listDate.indexOf(year), 1)

    const day: string = listDate[0]

    // les Regex de normalizeDateString nous permettent de parseInt sereinement
    if (parseInt(month) > 12 && parseInt(day) <= 12) {
      return year + '-' + day + '-' + month
    }
    return year + '-' + month + '-' + day
  }
}
