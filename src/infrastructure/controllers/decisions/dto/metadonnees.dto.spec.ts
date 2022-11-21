import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { MetadonneesDto } from './metadonnees.dto'
import { ValidateDtoPipe } from '../../../pipes/validateDto.pipe'
import { MockUtils } from '../../../utils/mock.utils'

class NoErrorThrownError extends Error {}

const getError = async <Error>(call: () => any): Promise<Error> => {
  try {
    await call()

    throw new NoErrorThrownError()
  } catch (error: any) {
    return error as Error
  }
}

describe('Validate MetadonneeDTO format', () => {
  const target = new ValidateDtoPipe()
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: MetadonneesDto,
    data: ''
  }

  const someValidMetaDonneeDto = new MockUtils().metadonneesDtoMock

  describe('juridictionName property', () => {
    it('throws an error when juridictionName is not a string', async () => {
      // GIVEN
      const invalidJuridictionName = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      const failingPropertyName = 'juridictionName'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when juridictionName is a too long string', async () => {
      // GIVEN
      const invalidJuridictionName = 'Some jurisdiction name which is way too long to fit'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      const failingPropertyName = 'juridictionName'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when juridictionName is a too short string', async () => {
      // GIVEN
      const invalidJuridictionName = 'S'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      const failingPropertyName = 'juridictionName'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('juridictionId property', () => {
    it('throws an error when juridictionId is invalid', async () => {
      // GIVEN
      const invalidJuridictionId = 'INVALID'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, juridictionId: invalidJuridictionId }
      const failingPropertyName = 'juridictionId'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when juridictionId is not a string', async () => {
      // GIVEN
      const invalidJuridictionId = 1234
      const invalidMetadonnee = { ...someValidMetaDonneeDto, juridictionId: invalidJuridictionId }
      const failingPropertyName = 'juridictionId'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('juridictionCode property', () => {
    it('throws an error when juridictionCode is not a string', async () => {
      // GIVEN
      const invalidJuridictionCode = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionCode: invalidJuridictionCode
      }
      const failingPropertyName = 'juridictionCode'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('numRegistre property', () => {
    it('throws an error when numRegistre is not a string', async () => {
      // GIVEN
      const invalidNumRegistre = 1
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numRegistre: invalidNumRegistre
      }
      const failingPropertyName = 'numRegistre'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when numRegistre is different than length 1', async () => {
      // GIVEN
      const invalidNumRegistre = 'Some numRegistre name'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numRegistre: invalidNumRegistre
      }
      const failingPropertyName = 'numRegistre'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('numRG property', () => {
    it('throws an error when numRG is not a string', async () => {
      // GIVEN
      const invalidNumRG = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numRG: invalidNumRG
      }
      const failingPropertyName = 'numRG'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when numRG is invalid', async () => {
      // GIVEN
      const invalidNumRG = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, numRG: invalidNumRG }
      const failingPropertyName = 'numRG'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('numMesureInstruction property', () => {
    it('throws an error when numMesureInstruction is not a string', async () => {
      // GIVEN
      const invalidNumMesureInstruction = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numMesureInstruction: invalidNumMesureInstruction
      }
      const failingPropertyName = 'numMesureInstruction'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when numMesureInstruction is different than length 10', async () => {
      // GIVEN
      const invalidNumMesureInstruction = 'short'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numMesureInstruction: invalidNumMesureInstruction
      }
      const failingPropertyName = 'numMesureInstruction'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('codeService property', () => {
    it('throws an error when codeService is not a string', async () => {
      // GIVEN
      const invalidCodeService = 12
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        codeService: invalidCodeService
      }
      const failingPropertyName = 'codeService'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when codeService is invalid', async () => {
      // GIVEN
      const invalidCodeService = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeService: invalidCodeService }
      const failingPropertyName = 'codeService'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('libelleService property', () => {
    it('throws an error when libelleService is not a string', async () => {
      // GIVEN
      const invalidLibelleService = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleService: invalidLibelleService
      }
      const failingPropertyName = 'libelleService'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when libelleService is longer than length 25', async () => {
      // GIVEN
      const invalidLibelleService =
        'my super hyper mega long libelleService string longer than length 25'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleService: invalidLibelleService
      }
      const failingPropertyName = 'libelleService'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('dateDecision property', () => {
    it('throws an error when dateDecision is not a string', async () => {
      // GIVEN
      const invalidDateDecision = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        dateDecision: invalidDateDecision
      }
      const failingPropertyName = 'dateDecision'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
    it('throws an error when dateDecision is a too long string', async () => {
      // GIVEN
      const invalidDateDecision = 'A too long string'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        dateDecision: invalidDateDecision
      }
      const failingPropertyName = 'dateDecision'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
    it('throws an error when dateDecision is a string but not a valid date', async () => {
      // GIVEN
      const invalidDateDecision = '20223333'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        dateDecision: invalidDateDecision
      }
      const failingPropertyName = 'dateDecision'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('codeDecision property', () => {
    it('throws an error when codeDecision is not a string', async () => {
      // GIVEN
      const invalidCodeDecision = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        codeDecision: invalidCodeDecision
      }
      const failingPropertyName = 'codeDecision'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when codeDecision is invalid', async () => {
      // GIVEN
      const invalidCodeDecision = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeDecision: invalidCodeDecision }
      const failingPropertyName = 'codeDecision'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('libelleCodeDecision property', () => {
    it('throws an error when libelleCodeDecision is not a string', async () => {
      // GIVEN
      const invalidLibelleCodeDecision = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleCodeDecision: invalidLibelleCodeDecision
      }
      const failingPropertyName = 'libelleCodeDecision'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when libelleCodeDecision is longer than length 200', async () => {
      // GIVEN
      const invalidLibelleCodeDecision =
        'My super text that is longer than 200 character is starting with this beautiful sentence and then going to another one which makes no sense but for the sake of testing it is necessary to do so and here I am with 225 character'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleCodeDecision: invalidLibelleCodeDecision
      }
      const failingPropertyName = 'libelleCodeDecision'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('validate PresidentDTO (president property) format', () => {
    describe('property fctPresident', () => {
      it('throws an error when fctPresident is not a string', async () => {
        // GIVEN
        const invalidFctPresident = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            fctPresident: invalidFctPresident
          }
        }
        const failingPropertyName = 'fctPresident'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })

    describe('property nomPresident', () => {
      it('throws an error when nomPresident is not a string', async () => {
        // GIVEN
        const invalidNomPresident = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...new MockUtils().presidentDtoMock,
            nomPresident: invalidNomPresident
          }
        }
        const failingPropertyName = 'nomPresident'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })

    describe('property prenomPresident', () => {
      it('throws an error when prenomPresident is not a string', async () => {
        // GIVEN
        const invalidPrenomPresident = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...new MockUtils().presidentDtoMock,
            prenomPresident: invalidPrenomPresident
          }
        }
        const failingPropertyName = 'prenomPresident'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })

    describe('property civilitePresident', () => {
      it('throws an error when civilitePresident is not a string', async () => {
        // GIVEN
        const invalidCivilitePresident = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...new MockUtils().presidentDtoMock,
            civilitePresident: invalidCivilitePresident
          }
        }
        const failingPropertyName = 'civilitePresident'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })
  })

  describe('chainage property', () => {
    it('throws an error when chainage is not an array', async () => {
      // GIVEN
      const invalidChainage = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        chainage: invalidChainage
      }
      const failingPropertyName = 'chainage'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when chainage is not an array of decision', async () => {
      // GIVEN
      const invalidChainage = [1, 2, 3]
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        chainage: invalidChainage
      }
      const failingPropertyName = 'chainage'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('validate DecisionDTO (decisionAssociee property) format', () => {
    it('throws an error when decisionAssociee is not defined', async () => {
      // GIVEN
      const { decisionAssociee, ...invalidMetadonnee } = someValidMetaDonneeDto
      const failingPropertyName = 'decisionAssociee'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    describe('property numRegistre', () => {
      it('throws an error when numRegistre is not a string', async () => {
        // GIVEN
        const invalidNumRegistre = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: { ...new MockUtils().decisionDtoMock, numRegistre: invalidNumRegistre }
        }
        const failingPropertyName = 'numRegistre'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })

      it('throws an error when numRegistre is different than length 1', async () => {
        // GIVEN
        const invalidNumRegistre = 'my num registre'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: { ...new MockUtils().decisionDtoMock, numRegistre: invalidNumRegistre }
        }
        const failingPropertyName = 'numRegistre'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })

    describe('property numRG', () => {
      it('throws an error when numRG is not a string', async () => {
        // GIVEN
        const invalidNumRG = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: { ...new MockUtils().decisionDtoMock, numRG: invalidNumRG }
        }
        const failingPropertyName = 'numRG'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })

      it('throws an error when numRG is invalid', async () => {
        // GIVEN
        const invalidNumRG = 'my num rg'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: { ...new MockUtils().decisionDtoMock, numRG: invalidNumRG }
        }
        const failingPropertyName = 'numRG'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })

    describe('property juridictionId', () => {
      it('throws an error when juridictionId is not a string', async () => {
        // GIVEN
        const invalidJuridictionId = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            juridictionId: invalidJuridictionId
          }
        }
        const failingPropertyName = 'juridictionId'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })

      it('throws an error when juridictionId is invalid', async () => {
        // GIVEN
        const invalidJuridictionId = 'my num registre'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            juridictionId: invalidJuridictionId
          }
        }
        const failingPropertyName = 'juridictionId'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })

    describe('property dateDecision', () => {
      it('throws an error when dateDecision is not a string', async () => {
        // GIVEN
        const invalidDateDecision = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            dateDecision: invalidDateDecision
          }
        }
        const failingPropertyName = 'dateDecision'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })

      it('throws an error when dateDecision is too long', async () => {
        // GIVEN
        const invalidDateDecision = 'my long date decision'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            dateDecision: invalidDateDecision
          }
        }
        const failingPropertyName = 'dateDecision'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })

      it('throws an error when dateDecision is not a valid date', async () => {
        // GIVEN
        const invalidDateDecision = '20223333'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            dateDecision: invalidDateDecision
          }
        }
        const failingPropertyName = 'dateDecision'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })

    describe('property numMesureInstruction', () => {
      it('throws an error when numMesureInstruction is not a string', async () => {
        // GIVEN
        const invalidNumMesureInstruction = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numMesureInstruction: invalidNumMesureInstruction
          }
        }
        const failingPropertyName = 'numMesureInstruction'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })

      it('throws an error when numMesureInstruction is different than length 10', async () => {
        // GIVEN
        const invalidNumMesureInstruction = 'small'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numMesureInstruction: invalidNumMesureInstruction
          }
        }
        const failingPropertyName = 'numMesureInstruction'
        // WHEN
        try {
          await target.transform(invalidMetadonnee, metadata)
        } catch (error) {
          // THEN
          expect(error).toBeInstanceOf(BadRequestException)
          expect(error.response.message[0]).toContain(failingPropertyName)
        }
      })
    })
  })

  describe('validate PartieDTO (partie property) format', () => {
    it.only('throws an error when partie is not defined', async () => {
      // GIVEN
      const { ...invalidMetadonnee } = someValidMetaDonneeDto
      const failingPropertyName = 'partie'

      const error = await getError(async () => target.transform(invalidMetadonnee, metadata))

      // WHEN
      console.log(error)
      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(BadRequestException)
      // expect(error.response.message).toContain('partie')

      // try {
      //   await target.transform(invalidMetadonnee, metadata).catch(error => {
      //     console.log(error)
      //   })
      //   expect(false).toBe(true)
      // } catch (error) {
      //   console.log(error);

      //   // THEN
      //   expect(error).toBeInstanceOf(BadRequestException)
      //   expect(error.response.message[0]).toContain(failingPropertyName)
      // }
    })

    // describe('property typePartie', () => {
    //   it('throws an error when typePartie is not a valid value', async () => {
    //     // GIVEN
    //     const invalidTypePartie = 123
    //     const invalidMetadonnee = {
    //       ...someValidMetaDonneeDto,
    //       partie: { ...new MockUtils().partieDtoMock, typePartie: invalidTypePartie }
    //     }
    //     const failingPropertyName = 'typePartie'
    //     // WHEN
    //     try {
    //       await target.transform(invalidMetadonnee, metadata)
    //     } catch (error) {
    //       // THEN
    //       expect(error).toBeInstanceOf(BadRequestException)
    //       expect(error.response.message[0]).toContain(failingPropertyName)
    //     }
    //   })

    // })
  })

  describe('sommaire property', () => {
    it('throws an error when sommaire is not a string', async () => {
      // GIVEN
      const invalidSommaire = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        sommaire: invalidSommaire
      }
      const failingPropertyName = 'sommaire'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('codeNAC property', () => {
    it('throws an error when codeNAC is not a string', async () => {
      // GIVEN
      const invalidCodeNAC = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        codeNAC: invalidCodeNAC
      }
      const failingPropertyName = 'codeNAC'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when codeNAC is invalid', async () => {
      // GIVEN
      const invalidCodeNAC = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeNAC: invalidCodeNAC }
      const failingPropertyName = 'codeNAC'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('libelleNAC property', () => {
    it('throws an error when libelleNAC is not a string', async () => {
      // GIVEN
      const invalidLibelleNAC = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleNAC: invalidLibelleNAC
      }
      const failingPropertyName = 'libelleNAC'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('codeNature property', () => {
    it('throws an error when codeNature is not a string', async () => {
      // GIVEN
      const invalidCodeNature = 12
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        codeNature: invalidCodeNature
      }
      const failingPropertyName = 'codeNature'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })

    it('throws an error when codeNature is invalid', async () => {
      // GIVEN
      const invalidCodeNature = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeNature: invalidCodeNature }
      const failingPropertyName = 'codeNature'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('libelleNature property', () => {
    it('throws an error when libelleNature is not a string', async () => {
      // GIVEN
      const invalidLibelleNature = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleNature: invalidLibelleNature
      }
      const failingPropertyName = 'libelleNature'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('public property', () => {
    it('throws an error when public is not a boolean', async () => {
      // GIVEN
      const invalidPublic = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        public: invalidPublic
      }
      const failingPropertyName = 'public'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('recomOccult property', () => {
    it('throws an error when recomOccult is not a boolean', async () => {
      // GIVEN
      const invalidRecomOccult = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        recomOccult: invalidRecomOccult
      }
      const failingPropertyName = 'recomOccult'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  describe('occultComp property', () => {
    it('throws an error when occultComp is not a string', async () => {
      // GIVEN
      const invalidOccultComp = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        occultComp: invalidOccultComp
      }
      const failingPropertyName = 'occultComp'
      // WHEN
      try {
        await target.transform(invalidMetadonnee, metadata)
      } catch (error) {
        // THEN
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.response.message[0]).toContain(failingPropertyName)
      }
    })
  })

  it('returns provided object when provided object is a MetadonneeDto with valid properties', async () => {
    // WHEN
    const response = await target.transform(someValidMetaDonneeDto, metadata)
    // THEN
    expect(response).toEqual(someValidMetaDonneeDto)
  })
})
