import { ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { ValidateDtoPipe } from '../../../api/infrastructure/pipes/validateDto.pipe'
import { MockUtils } from '../utils/mock.utils'
import { MetadonneesDto } from './metadonnees.dto'

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
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when idJuridiction is not a string', async () => {
      // GIVEN
      const invalidIdJuridiction = 1234
      const invalidMetadonnee = { ...someValidMetaDonneeDto, idJuridiction: invalidIdJuridiction }
      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
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
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('numeroMesureInstruction property', () => {
    it('throws an error when numeroMesureInstruction is not a string', async () => {
      // GIVEN
      const invalidNumeroMesureInstruction = 123
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroMesureInstruction: invalidNumeroMesureInstruction
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    it('throws an error when numeroMesureInstruction is different than length 10', async () => {
      // GIVEN
      const invalidNumeroMesureInstruction = 'short'
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        numeroMesureInstruction: invalidNumeroMesureInstruction
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
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property nom', () => {
      it('throws an error when nom is not a string', async () => {
        // GIVEN
        const invalidNom = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...new MockUtils().presidentDtoMock,
            nom: invalidNom
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property prenom', () => {
      it('throws an error when prenom is not a string', async () => {
        // GIVEN
        const invalidPrenom = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...new MockUtils().presidentDtoMock,
            prenom: invalidPrenom
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property civilite', () => {
      it('throws an error when civilite is not a string', async () => {
        // GIVEN
        const invalidCivilite = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          president: {
            ...new MockUtils().presidentDtoMock,
            civilite: invalidCivilite
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
      // eslint-disable-next-line
      const { decisionAssociee, ...invalidMetadonnee } = someValidMetaDonneeDto

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    describe('property numeroRegistre', () => {
      it('throws an error when numeroRegistre is not a string', async () => {
        // GIVEN
        const invalidNumeroRegistre = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numeroRegistre: invalidNumeroRegistre
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when numeroRegistre is different than length 1', async () => {
        // GIVEN
        const invalidNumeroRegistre = 'my num registre'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numeroRegistre: invalidNumeroRegistre
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property numeroRoleGeneral', () => {
      it('throws an error when numeroRoleGeneral is not a string', async () => {
        // GIVEN
        const invalidNumeroRoleGeneral = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numeroRoleGeneral: invalidNumeroRoleGeneral
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
      it('throws an error when numeroRoleGeneral is invalid', async () => {
        // GIVEN
        const invalidNumeroRoleGeneral = 'my num rg'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numeroRoleGeneral: invalidNumeroRoleGeneral
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property idJuridiction', () => {
      it('throws an error when idJuridiction is not a string', async () => {
        // GIVEN
        const invalidIdJuridiction = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            idJuridiction: invalidIdJuridiction
          }
        }
        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when idJuridiction is invalid', async () => {
        // GIVEN
        const invalidIdJuridiction = 'my num registre'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            idJuridiction: invalidIdJuridiction
          }
        }
        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property date', () => {
      it('throws an error when date is not a string', async () => {
        // GIVEN
        const invalidDate = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            date: invalidDate
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when date is too long', async () => {
        // GIVEN
        const invalidDate = '2022-11-22T 07:07:07'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            date: invalidDate
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when date is not a valid date', async () => {
        // GIVEN
        const invalidDate = '20223333'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            date: invalidDate
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property numeroMesureInstruction', () => {
      it('throws an error when numeroMesureInstruction is not a string', async () => {
        // GIVEN
        const invalidNumeroMesureInstruction = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numeroMesureInstruction: invalidNumeroMesureInstruction
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when numeroMesureInstruction is different than length 10', async () => {
        // GIVEN
        const invalidNumeroMesureInstruction = 'small'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          decisionAssociee: {
            ...new MockUtils().decisionDtoMock,
            numeroMesureInstruction: invalidNumeroMesureInstruction
          }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
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
      // eslint-disable-next-line
      const { partie, ...invalidMetadonnee } = someValidMetaDonneeDto

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })

    describe('property type', () => {
      it('throws an error when type is not a valid value', async () => {
        // GIVEN
        const invalidType = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, type: invalidType }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when type is not a valid enum value', async () => {
        // GIVEN
        const invalidType = '123'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, type: invalidType }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property nom', () => {
      it('throws an error when nom is not a string', async () => {
        // GIVEN
        const invalidNom = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, nom: invalidNom }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property prenom', () => {
      it('throws an error when prenom is not a string', async () => {
        // GIVEN
        const invalidPrenom = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, prenom: invalidPrenom }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property civilite', () => {
      it('throws an error when civilite is not a string', async () => {
        // GIVEN
        const invalidCivilite = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, civilite: invalidCivilite }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })
    })

    describe('property qualite', () => {
      it('throws an error when qualite is not a valid value', async () => {
        // GIVEN
        const invalidQualite = 123
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, qualite: invalidQualite }
        }

        // WHEN
        await expect(async () => await target.transform(invalidMetadonnee, metadata))
          // THEN
          .rejects.toThrow(BadRequestException)
      })

      it('throws an error when qualite is not a valid enum value', async () => {
        // GIVEN
        const invalidQualite = '123'
        const invalidMetadonnee = {
          ...someValidMetaDonneeDto,
          partie: { ...new MockUtils().partieDtoMock, qualite: invalidQualite }
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

  describe('recommandationOccultation property', () => {
    it('throws an error when recommandationOccultation is not a boolean', async () => {
      // GIVEN
      const invalidRecommandationOccultation = 12345
      const invalidMetadonnee = {
        ...someValidMetaDonneeDto,
        recommandationOccultation: invalidRecommandationOccultation
      }

      // WHEN
      await expect(async () => await target.transform(invalidMetadonnee, metadata))
        // THEN
        .rejects.toThrow(BadRequestException)
    })
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
        .rejects.toThrow(BadRequestException)
    })
  })
})
