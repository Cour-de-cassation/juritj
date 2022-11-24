import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { MetadonneesDto } from './metadonnees.dto'
import { ValidateDtoPipe } from '../../../pipes/validateDto.pipe'
import { MockUtils } from '../../../utils/mock.utils'

describe('Validate MetadonneeDTO format', () => {
  const target = new ValidateDtoPipe()
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: MetadonneesDto,
    data: ''
  }

  const someValidMetaDonneeDto = new MockUtils().metadonneesDtoMock

  describe('Success case', () => {
    it('returns provided object when provided object is a MetadonneeDto with valid properties', async () => {
      // WHEN
      const response = await target.transform(someValidMetaDonneeDto, metadata)
      // THEN
      expect(response).toEqual(someValidMetaDonneeDto)
    })
  })

  describe('juridictionName property', () => {
    it('throws an error when juridictionName is not a string', async () => {
      // GIVEN
      const invalidJuridictionName = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when juridictionName has more than 42 characters', async () => {
      // GIVEN
      const invalidJuridictionName = 'Some jurisdiction name which is way too long to fit'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when juridictionName has less than 2 characters', async () => {
      // GIVEN
      const invalidJuridictionName = 'S'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        juridictionName: invalidJuridictionName
      }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('juridictionId property', () => {
    it('throws an error when juridictionId is invalid', async () => {
      // GIVEN
      const invalidJuridictionId = 'INVALID'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, juridictionId: invalidJuridictionId }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when juridictionId is not a string', async () => {
      // GIVEN
      const invalidJuridictionId = 1234
      const invalidMetadonnee = { ...someValidMetaDonneeDto, juridictionId: invalidJuridictionId }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when numRegistre is different than length 1', async () => {
      // GIVEN
      const invalidNumRegistre = 'Some numRegistre name'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numRegistre: invalidNumRegistre
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when numRG is invalid', async () => {
      // GIVEN
      const invalidNumRG = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, numRG: invalidNumRG }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when numMesureInstruction is different than length 10', async () => {
      // GIVEN
      const invalidNumMesureInstruction = 'short'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numMesureInstruction: invalidNumMesureInstruction
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when codeService is invalid', async () => {
      // GIVEN
      const invalidCodeService = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeService: invalidCodeService }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when libelleService is longer than length 25', async () => {
      // GIVEN
      const invalidLibelleService =
        'my super hyper mega long libelleService string longer than length 25'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleService: invalidLibelleService
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when dateDecision is more than 8 characters', async () => {
      // GIVEN
      const invalidDateDecision = '2022-11-22T 07:07:07'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        dateDecision: invalidDateDecision
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when dateDecision is a string but incorrect valid values', async () => {
      // GIVEN
      const invalidDateDecision = '20223333'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        dateDecision: invalidDateDecision
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when dateDecision is a string but incorrect format', async () => {
      // GIVEN
      const invalidDateDecision = '20102022' // DDMMYYYY instead of YYYYMMDD
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        dateDecision: invalidDateDecision
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when dateDecision is a string but incorrect format', async () => {
      // GIVEN
      const invalidDateDecision = '20223012' // YYYYDDMM instead of YYYYMMDD
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        dateDecision: invalidDateDecision
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when codeDecision is invalid', async () => {
      // GIVEN
      const invalidCodeDecision = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeDecision: invalidCodeDecision }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when libelleCodeDecision is longer than length 200', async () => {
      // GIVEN
      const invalidLibelleCodeDecision =
        'My super text that is longer than 200 character is starting with this beautiful sentence and then going to another one which makes no sense but for the sake of testing it is necessary to do so and here I am with 225 character'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        libelleCodeDecision: invalidLibelleCodeDecision
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
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

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
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

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
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

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when chainage is not an array of decision', async () => {
      // GIVEN
      const invalidChainage = [1, 2, 3]
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        chainage: invalidChainage
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('validate DecisionDTO (decisionAssociee property) format', () => {
    it('throws an error when decisionAssociee is not defined', async () => {
      // GIVEN
      const { decisionAssociee, ...invalidMetadonnee } = someValidMetaDonneeDto

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    describe('property numRegistre', () => {
      it('throws an error when numRegistre is not a string', async () => {
        // GIVEN
        const invalidNumRegistre = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: { ...new MockUtils().decisionDtoMock, numRegistre: invalidNumRegistre }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when numRegistre is different than length 1', async () => {
        // GIVEN
        const invalidNumRegistre = 'my num registre'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: { ...new MockUtils().decisionDtoMock, numRegistre: invalidNumRegistre }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
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

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
      it('throws an error when numRG is invalid', async () => {
        // GIVEN
        const invalidNumRG = 'my num rg'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: { ...new MockUtils().decisionDtoMock, numRG: invalidNumRG }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
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
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when dateDecision is too long', async () => {
      // GIVEN
      const invalidDateDecision = '2022-11-22T 07:07:07'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        decisionAssociee: {
          ...new MockUtils().decisionDtoMock,
          dateDecision: invalidDateDecision
        }
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('parties property', () => {
    it('throws an error when parties is not an array', async () => {
      // GIVEN
      const invalidParties = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        parties: invalidParties
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when parties is not an array of partie', async () => {
      // GIVEN
      const invalidParties = [1, 2, 3]
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        parties: invalidParties
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('validate PartieDTO (partie property) format', () => {
    it('throws an error when partie is not defined', async () => {
      // GIVEN
      const { partie, ...invalidMetadonnee } = someValidMetaDonneeDto

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    describe('property typePartie', () => {
      it('throws an error when typePartie is not a valid value', async () => {
        // GIVEN
        const invalidTypePartie = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, typePartie: invalidTypePartie }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when typePartie is not a valid enum value', async () => {
        // GIVEN
        const invalidTypePartie = '123'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, typePartie: invalidTypePartie }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property nomPartie', () => {
      it('throws an error when nomPartie is not a string', async () => {
        // GIVEN
        const invalidNomPartie = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, nomPartie: invalidNomPartie }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property prenomPartie', () => {
      it('throws an error when prenomPartie is not a string', async () => {
        // GIVEN
        const invalidprenomPartie = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, prenomPartie: invalidprenomPartie }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property civilitePartie', () => {
      it('throws an error when civilitePartie is not a string', async () => {
        // GIVEN
        const invalidCivilitePartie = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, civilitePartie: invalidCivilitePartie }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property qualitePartie', () => {
      it('throws an error when qualitePartie is not a valid value', async () => {
        // GIVEN
        const invalidQualitePartie = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, qualitePartie: invalidQualitePartie }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when qualitePartie is not a valid enum value', async () => {
        // GIVEN
        const invalidQualitePartie = '123'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, qualitePartie: invalidQualitePartie }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })
  })

  describe('sommaire property', () => {
    it('throws an error when sommaire is not a string', async () => {
      // GIVEN
      const invalidSommaire = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        sommaire: invalidSommaire
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when codeNAC is invalid', async () => {
      // GIVEN
      const invalidCodeNAC = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeNAC: invalidCodeNAC }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when codeNature is invalid', async () => {
      // GIVEN
      const invalidCodeNature = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeNature: invalidCodeNature }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })
  })
})
