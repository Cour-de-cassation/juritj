import { MockUtils } from "../../src/infrastructure/utils/mock.utils"
import { executeNormalization } from "./normalization"

const metadonnees = new MockUtils().metadonneesDtoMock

describe('normalization script', () => {
    describe('metadata -> unique ID generation', () => {
      it('adds a unique ID as a idDecision property to metadata when required properties are provided', () => {
        // GIVEN
        const someMetadonnees = {...metadonnees}          
        // WHEN
        executeNormalization(someMetadonnees)
        // THEN
        expect(someMetadonnees).toHaveProperty('idDecision')
      })

      it('adds a unique ID as a idDecision property to metadata when only mandatory properties are provided', () => {
        // GIVEN
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {numeroMesureInstruction, ...someMetadonnees} = metadonnees          
        // WHEN
        executeNormalization(someMetadonnees)
        // THEN
        expect(someMetadonnees).toHaveProperty('idDecision')
      })
        
      it('does not add a unique ID as a idDecision property to metadata when required properties are not provided', () => {
          // GIVEN
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {idJuridiction, ...someMetadonnees} = metadonnees          
          // WHEN
          executeNormalization(someMetadonnees)
          // THEN
          expect(someMetadonnees).not.toHaveProperty('idDecision')
      })

    })
})