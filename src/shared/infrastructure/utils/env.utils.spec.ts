import { getEnvironment } from './env.utils'

describe('read and get environment variables', () => {
  it('returns the value of a predefined environment variable', () => {
    // WHEN
    const actual = getEnvironment('DOC_LOGIN')

    // THEN
    expect(actual).toBeDefined()
  })

  it('returns an error when no environment variable exists', () => {
    // WHEN / THEN
    expect(() => getEnvironment('toto')).toThrowError()
  })
})
