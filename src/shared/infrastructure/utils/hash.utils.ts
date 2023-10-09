const HASH_INITIAL_VALUE = 5381
const MULTIPLIER = 33

export function hashDecisionId(decisionId: string): number {
  let hashValue = HASH_INITIAL_VALUE,
    counter = decisionId.length

  while (counter) {
    hashValue = (hashValue * MULTIPLIER) ^ decisionId.charCodeAt(--counter)
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, we convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hashValue >>> 0
}
