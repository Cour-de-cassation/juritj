import { ArgumentMetadata } from '@nestjs/common'
import { Occultation } from 'dbsder-api-types'
import { MockUtils } from '../utils/mock.utils'
import { MetadonneesDto, PresidentDto } from './metadonnees.dto'
import { ValidateDtoPipe } from '../../../api/infrastructure/pipes/validateDto.pipe'
import { BadPropertiesException } from '../../../api/infrastructure/exceptions/missingProperties.exception'

describe('Validate MetadonneeDTO format', () => {
  const target = new ValidateDtoPipe()
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: MetadonneesDto,
    data: ''
  }

  const mockUtils = new MockUtils()
  const someValidMetaDonneeDto = mockUtils.mandatoryMetadonneesDtoMock

  describe('Success case when all mandatory fields are provided', () => {
    it('returns provided object when provided object is a MetadonneeDto with valid mandatory properties', async () => {
      // WHEN
      const response = await target.transform(someValidMetaDonneeDto, metadata)
      // THEN
      expect(response).toEqual(someValidMetaDonneeDto)
    })
  })

  describe('nomJuridiction property', () => {
    it('throws an error when nomJuridiction is not a string', async () => {
      // GIVEN
      const invalidNomJuridiction = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        nomJuridiction: invalidNomJuridiction
      }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when nomJuridiction has more than 42 characters', async () => {
      // GIVEN
      const invalidNomJuridiction = 'Some jurisdiction name which is way too long to fit'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        nomJuridiction: invalidNomJuridiction
      }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when nomJuridiction has less than 2 characters', async () => {
      // GIVEN
      const invalidNomJuridiction = 'S'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        nomJuridiction: invalidNomJuridiction
      }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('idJuridiction property', () => {
    it('throws an error when idJuridiction is invalid', async () => {
      // GIVEN
      const invalidIdJuridiction = 'INVALID'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, idJuridiction: invalidIdJuridiction }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when idJuridiction is not a string', async () => {
      // GIVEN
      const invalidIdJuridiction = 1234
      const invalidMetadonnee = { ...someValidMetaDonneeDto, idJuridiction: invalidIdJuridiction }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('codeJuridiction property', () => {
    it('throws an error when codeJuridiction is not a string', async () => {
      // GIVEN
      const invalidCodeJuridiction = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        codeJuridiction: invalidCodeJuridiction
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('numeroRegistre property', () => {
    it('throws an error when numeroRegistre is not a string', async () => {
      // GIVEN
      const invalidNumeroRegistre = 1
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroRegistre: invalidNumeroRegistre
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when numeroRegistre is different than length 1', async () => {
      // GIVEN
      const invalidNumeroRegistre = 'Some numeroRegistre name'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroRegistre: invalidNumeroRegistre
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('numeroRoleGeneral property', () => {
    it('throws an error when numeroRoleGeneral is not a string', async () => {
      // GIVEN
      const invalidNumeroRoleGeneral = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroRoleGeneral: invalidNumeroRoleGeneral
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when numeroRoleGeneral is invalid', async () => {
      // GIVEN
      const invalidNumeroRoleGeneral = 'INVALID REGEX'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroRoleGeneral: invalidNumeroRoleGeneral
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('numeroMesureInstruction property', () => {
    it('throws an error when numeroMesureInstruction is not a list of strings', async () => {
      // GIVEN
      const invalidNumeroMesureInstruction = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroMesureInstruction: invalidNumeroMesureInstruction
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when an element of numeroMesureInstruction does not have 10 characters', async () => {
      // GIVEN
      const invalidNumeroMesureInstruction = 'short'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroMesureInstruction: [invalidNumeroMesureInstruction]
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('succeeds when numeroMesureInstruction is a list of 10 characters strings', async () => {
      // GIVEN
      const validNumeroMesureInstruction = ['1234567890']
      const metadonneesWithValidNumeroMesureInstruction = {
        ...someValidMetaDonneeDto,
        numeroMesureInstruction: validNumeroMesureInstruction
      }

      // WHEN
      const response = await target.transform(metadonneesWithValidNumeroMesureInstruction, metadata)

      // THEN
      expect(response).toEqual(metadonneesWithValidNumeroMesureInstruction)
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
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when codeService is invalid', async () => {
      // GIVEN
      const invalidCodeService = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeService: invalidCodeService }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when codeDecision has more than 3 characters', async () => {
      // GIVEN
      const tooLongCodeDecision = 'INVALID REGEX'
      const firstInvalidMetadonnee = {
        ...someValidMetaDonneeDto,
        codeDecision: tooLongCodeDecision
      }

      // WHEN
      await expect(async () => await target.transform(firstInvalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when codeDecision has less than 3 characters', async () => {
      // GIVEN
      const tooShortCodeDecision = 'a2'
      const secondInvalidMetadonnee = {
        ...someValidMetaDonneeDto,
        codeDecision: tooShortCodeDecision
      }

      // WHEN
      await expect(async () => await target.transform(secondInvalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('succeeds when codeDecision has 3 characters', async () => {
      // GIVEN
      const metadonneesWith3charactersCodeDecision = {
        ...someValidMetaDonneeDto,
        codeDecision: '4a2'
      }

      // WHEN
      const response = await target.transform(metadonneesWith3charactersCodeDecision, metadata)

      // THEN
      expect(response).toEqual(metadonneesWith3charactersCodeDecision)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('validate PresidentDTO (president property) format', () => {
    it('succeeds when president property only has mandatory elements', async () => {
      // GIVEN
      const presidentWithOneProperty: PresidentDto = {
        nom: 'some valid name',
        fonction: 'some title'
      }
      const metadonneesWithPresident = {
        ...someValidMetaDonneeDto,
        president: presidentWithOneProperty
      }

      // WHEN
      const response = await target.transform(metadonneesWithPresident, metadata)

      // THEN
      expect(response).toEqual(metadonneesWithPresident)
    })

    it('succeeds when president property has all elements', async () => {
      // GIVEN
      const presidentWithOneProperty: PresidentDto = mockUtils.presidentDtoMock
      const metadonneesWithPresident = {
        ...someValidMetaDonneeDto,
        president: presidentWithOneProperty
      }

      // WHEN
      const response = await target.transform(metadonneesWithPresident, metadata)

      // THEN
      expect(response).toEqual(metadonneesWithPresident)
    })

    it('throws an error when president property does not have mandatory function element', async () => {
      // GIVEN
      const presidentWithPrenomAndNomProperties = { prenom: 'some valid surname', nom: 'some name' }
      const metadonneesWithPresident = {
        ...someValidMetaDonneeDto,
        president: presidentWithPrenomAndNomProperties
      }

      // WHEN
      await expect(async () => await target.transform(metadonneesWithPresident, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    describe('property fonction', () => {
      it('throws an error when fonction is not a string', async () => {
        // GIVEN
        const invalidFonction = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            fonction: invalidFonction
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
    })

    describe('property nom', () => {
      it('throws an error when nom is not a string', async () => {
        // GIVEN
        const invalidNom = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...mockUtils.presidentDtoMock,
            nom: invalidNom
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
    })

    describe('property prenom', () => {
      it('throws an error when prenom is not a string', async () => {
        // GIVEN
        const invalidPrenom = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...mockUtils.presidentDtoMock,
            prenom: invalidPrenom
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
    })

    describe('property civilite', () => {
      it('throws an error when civilite is not a string', async () => {
        // GIVEN
        const invalidCivilite = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...mockUtils.presidentDtoMock,
            civilite: invalidCivilite
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
    })
  })

  describe('validate DecisionDTO (decisionAssociee property) format', () => {
    it('succeeds when decisionAssociee is provided with all attributes', async () => {
      // GIVEN
      const metadonneesWithDecisionAssociee = mockUtils.allAttributesMetadonneesDtoMock

      // WHEN
      const response = await target.transform(metadonneesWithDecisionAssociee, metadata)

      // THEN
      expect(response).toEqual(metadonneesWithDecisionAssociee)
    })

    describe('property numeroRegistre', () => {
      it('throws an error when numeroRegistre is not a string', async () => {
        // GIVEN
        const invalidNumeroRegistre = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            numeroRegistre: invalidNumeroRegistre
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })

      it('throws an error when numeroRegistre is different than length 1', async () => {
        // GIVEN
        const invalidNumeroRegistre = 'my num registre'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            numeroRegistre: invalidNumeroRegistre
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
    })

    describe('property numeroRoleGeneral', () => {
      it('throws an error when numeroRoleGeneral is not a string', async () => {
        // GIVEN
        const invalidNumeroRoleGeneral = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            numeroRoleGeneral: invalidNumeroRoleGeneral
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
      it('throws an error when numeroRoleGeneral is invalid', async () => {
        // GIVEN
        const invalidNumeroRoleGeneral = 'my num rg'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            numeroRoleGeneral: invalidNumeroRoleGeneral
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
    })

    describe('property idJuridiction', () => {
      it('throws an error when idJuridiction is not a string', async () => {
        // GIVEN
        const invalidIdJuridiction = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            idJuridiction: invalidIdJuridiction
          }
        }
        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })

      it('throws an error when idJuridiction is invalid', async () => {
        // GIVEN
        const invalidIdJuridiction = 'my num registre'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            idJuridiction: invalidIdJuridiction
          }
        }
        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
    })

    describe('property date', () => {
      it('throws an error when date is not a string', async () => {
        // GIVEN
        const invalidDate = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            date: invalidDate
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })

      it('throws an error when date is too long', async () => {
        // GIVEN
        const invalidDate = '2022-11-22T 07:07:07'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            date: invalidDate
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })

      it('throws an error when date is not a valid date', async () => {
        // GIVEN
        const invalidDate = '20223333'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...mockUtils.decisionAssocieeDtoMock,
            date: invalidDate
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadPropertiesException)
      })
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when codeNAC is invalid', async () => {
      // GIVEN
      const invalidCodeNAC = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeNAC: invalidCodeNAC }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when codeNature is invalid', async () => {
      // GIVEN
      const invalidCodeNature = 'INVALID REGEX'
      const invalidMetadonnee = { ...someValidMetaDonneeDto, codeNature: invalidCodeNature }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
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
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('decisionPublique property', () => {
    it('throws an error when decisionPublique is not a boolean', async () => {
      // GIVEN
      const invalidDecisionPublique = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        decisionPublique: invalidDecisionPublique
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('recommandationOccultation property', () => {
    it('throws an error when recommandationOccultation has a wrong format', async () => {
      // GIVEN
      const invalidRecommandationOccultation = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        recommandationOccultation: invalidRecommandationOccultation
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it('throws an error when recommandationOccultation is not a valid value', async () => {
      // GIVEN
      const invalidRecommandationOccultation = 'some invalid value'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        recommandationOccultation: invalidRecommandationOccultation
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })

    it.each(Object.values(Occultation))(
      'succeeds when recommandationOccultation is equal to %p',
      async (providedRecommandationOccultation) => {
        // GIVEN
        const validMetadonnees = {
          ...someValidMetaDonneeDto,
          recommandationOccultation: providedRecommandationOccultation
        }

        // WHEN
        const response = await target.transform(validMetadonnees, metadata)

        // THEN
        expect(response).toEqual(validMetadonnees)
      }
    )
  })

  describe('occultationComplementaire property', () => {
    it('throws an error when occultationComplementaire is not a string', async () => {
      // GIVEN
      const invalidOccultationComplementaire = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        occultationComplementaire: invalidOccultationComplementaire
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('selection property', () => {
    it('throws an error when selection is not a boolean', async () => {
      // GIVEN
      const invalidSelection = 'invalid selection'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        selection: invalidSelection
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('matiereDeterminee property', () => {
    it('throws an error when matiereDeterminee is not a boolean', async () => {
      // GIVEN
      const invalidMatiereDeterminee = 'invalid matiereDeterminee'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        matiereDeterminee: invalidMatiereDeterminee
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('pourvoiLocal property', () => {
    it('throws an error when pourvoiLocal is not a boolean', async () => {
      // GIVEN
      const invalidPourvoiLocal = 'invalid pourvoiLocal'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        pourvoiLocal: invalidPourvoiLocal
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('pourvoiCourDeCassation property', () => {
    it('throws an error when pourvoiCourDeCassation is not a boolean', async () => {
      // GIVEN
      const invalidPourvoiCourDeCassation = 'invalid pourvoiCourDeCassation'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        pourvoiCourDeCassation: invalidPourvoiCourDeCassation
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('debatPublic property', () => {
    it('throws an error when debatPublic is not a boolean', async () => {
      // GIVEN
      const invalidDebatPublic = 'invalid debatPublic'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        debatPublic: invalidDebatPublic
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })

  describe('idDecision property', () => {
    it('throws an error when idDecision is not a string', async () => {
      // GIVEN
      const invalidIdDecision = 2345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        idDecision: invalidIdDecision
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadPropertiesException)
    })
  })
})
