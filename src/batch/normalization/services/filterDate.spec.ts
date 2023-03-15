describe('filter date function', () => {
  it('marks labelStatus as toBeTreated if date is correct', () => {
    // GIVEN
    // WHEN
    // THEN
  })
})

// import { replaceByNumericalMonth, normalizeDatesToIso8601 } from './convertDates'

// describe('Convert dates in ISO8601 format', () => {
//   it('returns provided text when there are no dates to format', () => {
//     // GIVEN
//     const textWithoutDate = 'some text'
//     const expected = 'some text'

//     // WHEN
//     const normalizedMonth = replaceByNumericalMonth(textWithoutDate)

//     // THEN
//     expect(normalizedMonth).toEqual(expected)
//   })

//   describe('when date has a literal month', () => {
//     it('converts literal month to a numerical month format', () => {
//       // GIVEN
//       const literalMonths =
//         'janvier Février mars Avril mai Juin juillet août septembre octobre novembre décembre'
//       const numericalMonths = '01 02 03 04 05 06 07 08 09 10 11 12'

//       // WHEN
//       const normalizedMonth = replaceByNumericalMonth(literalMonths)

//       // THEN
//       expect(normalizedMonth).toEqual(numericalMonths)
//     })

//     it('converts a DD month YYYY date to a YYYY-MM-DD date format', () => {
//       // GIVEN
//       const literalStringDate = 'le 25 décembre 2021 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-25 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })

//     it('converts a D month YYYY date to a YYYY-MM-DD date format', () => {
//       // GIVEN
//       const literalStringDate = 'le 9 décembre 2021 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-09 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })
//   })

//   describe('when date has "-" separator', () => {
//     it('converts a DD-MM-YYYY date to a YYYY-MM-DD date format', () => {
//       // GIVEN
//       const literalStringDate = 'le 25-12-2021 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-25 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })

//     it('converts a MM-DD-YYYY date to a YYYY-MM-DD date format when DD is > MM', () => {
//       // GIVEN
//       const literalStringDate = 'le 12-25-2021 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-25 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })

//     it('converts a YYYY-DD-MM date to a YYYY-MM-DD date format when DD is > MM', () => {
//       // GIVEN
//       const literalStringDate = 'le 2021-25-12 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-25 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })

//     it('converts a YYYY-DD-MM date to a YYYY-MM-DD date format when DD <= MM', () => {
//       // GIVEN
//       const literalStringDate = 'le 11-12-2022 il y a ...'
//       const correctDateFormat = 'le 2022-12-11 il y a ...'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })
//   })

//   describe('when date has "/" separator', () => {
//     it('converts a DD/MM/YYYY date to a YYYY-MM-DD date format', () => {
//       // GIVEN
//       const literalStringDate = 'le 25/12/2021 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-25 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })

//     it('converts a MM/DD/YYYY date to a YYYY-MM-DD date format when DD is > MM', () => {
//       // GIVEN
//       const literalStringDate = 'le 12/25/2021 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-25 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })

//     it('converts a YYYY/DD/MM date to a YYYY-MM-DD date format when DD is > MM', () => {
//       // GIVEN
//       const literalStringDate = 'le 2021/25/12 il y a un repas de noel'
//       const correctDateFormat = 'le 2021-12-25 il y a un repas de noel'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })

//     it('converts a YYYY/DD/MM date to a YYYY-MM-DD date format when DD <= MM', () => {
//       // GIVEN
//       const literalStringDate = 'le 11/12/2022 il y a ...'
//       const correctDateFormat = 'le 2022-12-11 il y a ...'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(literalStringDate)

//       // THEN
//       expect(normalizedDateString).toEqual(correctDateFormat)
//     })
//   })

//   describe('when text has multiple dates', () => {
//     it('converts all dates to YYYY-MM-DD format', () => {
//       // GIVEN
//       const textWithMultipleDates = 'le 11/12/2022 il y a 9 janvier 2022'
//       const expectedText = 'le 2022-12-11 il y a 2022-01-09'

//       // WHEN
//       const normalizedDateString = normalizeDatesToIso8601(textWithMultipleDates)

//       // THEN
//       expect(normalizedDateString).toEqual(expectedText)
//     })
//   })
// })
