// source : https://saturncloud.io/blog/why-are-5381-and-33-so-important-in-the-djb2-algorithm/
const HASH_INITIAL_VALUE = 5381
const MULTIPLIER = 33

// djb2 algorithme source: https://github.com/darkskyapp/string-hash/blob/master/index.js
export function hashDecisionId(decisionId: string): number {
  let hashValue = HASH_INITIAL_VALUE,
    counter = decisionId.length

  while (counter) {
    hashValue = (hashValue * MULTIPLIER) ^ decisionId.charCodeAt(--counter)
  }

  /* JavaScript effectue des opérations bit à bit (comme XOR, ci-dessus) sur des entiers signés de 32 bits. 
  Comme nous voulons que les résultats soient toujours positifs, 
  nous convertissons l'entier signé en un entier non signé en effectuant un décalage de bits non signé.*/
  return hashValue >>> 0
}
