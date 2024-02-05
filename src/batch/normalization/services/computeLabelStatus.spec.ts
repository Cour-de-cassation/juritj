import { LabelStatus } from 'dbsder-api-types'
import { computeLabelStatus } from './computeLabelStatus'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { codeNACListNotPublic, codeNACListPartiallyPublic } from '../infrastructure/codeNACList'

jest.mock('../index', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn()
  }
}))

describe('updateLabelStatus', () => {
  const mockUtils = new MockUtils()
  describe('Returns provided labelStatus', () => {
    it('when decision is not ignored', () => {
      // GIVEN
      const dateDecember2023 = new Date(2023, 11, 31)
      const dateMarch2024 = new Date(2024, 2, 29)
      const mockDecisionLabel = {
        ...mockUtils.decisionTJMock,
        dateDecision: dateDecember2023.toISOString(),
        dateCreation: dateMarch2024.toISOString(),
        public: true
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })

    it(`when decision codeDecision is in transmissible codeDecision list`, () => {
      // GIVEN
      const mockDecisionLabel = {
        ...mockUtils.decisionTJMock,
        codeDecision: '22H'
      }
      const expectedLabelStatus = LabelStatus.TOBETREATED

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })
  })

  describe('changes labelStatus if it has exceptions', () => {
    describe('returns ignored_decisionDateIncoherente', () => {
      it('when decision is older than 6 months', () => {
        // GIVEN
        const dateDecisionSevenMonthsBefore = new Date(2022, 11, 15)
        const dateCreation = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionTJMock,
          dateDecision: dateDecisionSevenMonthsBefore.toISOString(),
          dateCreation: dateCreation.toISOString(),
          public: true
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when dateDecision is in the future compared to dateCreation', () => {
        // GIVEN
        const dateDecisionInTheFuture = new Date(2023, 7, 20)
        const dateCreation = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionTJMock,
          dateDecision: dateDecisionInTheFuture.toISOString(),
          dateCreation: dateCreation.toISOString(),
          public: true
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_DECISION_INCOHERENTE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    it('returns ignored_decisionNonPublique when decision is not public', () => {
      // GIVEN
      const mockDecisionLabel = {
        ...new MockUtils().decisionTJMock,
        public: false
      }
      const expectedLabelStatus = LabelStatus.IGNORED_DECISION_NON_PUBLIQUE

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })

    it('returns ignored_debatNonPublic when decision debat is not public', () => {
      // GIVEN
      const mockDecisionLabel = {
        ...new MockUtils().decisionTJMock,
        debatPublic: false
      }
      const expectedLabelStatus = LabelStatus.IGNORED_DEBAT_NON_PUBLIC

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })

    it('returns ignored_codeDecisionBloqueCC when codeDecision is not in the list of codeDecision that needs to be transmitted to CC', () => {
      // GIVEN
      const mockDecisionLabel = {
        ...new MockUtils().decisionTJMock,
        codeDecision: '32A'
      }
      const expectedLabelStatus = LabelStatus.IGNORED_CODE_DECISION_BLOQUE_CC

      // WHEN
      mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

      // THEN
      expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
    })

    describe('returns ignored_codeNACdeDecisionNonPublique', () => {
      codeNACListNotPublic.forEach((codeNAC) => {
        it(`when decision has ${codeNAC} NACCode indicating that the decision can not be public`, () => {
          // GIVEN
          const mockDecisionLabel = {
            ...new MockUtils().decisionTJMock,
            NACCode: codeNAC
          }
          const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE

          // WHEN
          mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

          // THEN
          expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
        })
      })

      it('when decision has a transmissible NACCode that is also not public', () => {
        // GIVEN
        const mockDecisionLabel = {
          ...new MockUtils().decisionTJMock,
          NACCode: '11E'
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })

    describe('returns ignored_codeNACdeDecisionPartiellementPublique', () => {
      codeNACListPartiallyPublic.forEach((codeNAC) => {
        it(`when decision has ${codeNAC} NACCode indicating that the decision is partially public`, () => {
          // GIVEN
          const mockDecisionLabel = {
            ...new MockUtils().decisionTJMock,
            NACCode: codeNAC
          }
          const expectedLabelStatus = LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE

          // WHEN
          mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

          // THEN
          expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
        })
      })
    })

    describe('returns ignored_dateAvantMiseEnService', () => {
      it('when decisionDate is before mise en service date', () => {
        // GIVEN
        const dateDecisionBeforeMiseEnService = new Date(2023, 11, 13)
        const mockDecisionLabel = {
          ...new MockUtils().decisionTJMock,
          dateDecision: dateDecisionBeforeMiseEnService.toISOString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })

      it('when decisionDate is in January 2023 and dateCreation is in July 2023', () => {
        // GIVEN
        const dateJanuary2023 = new Date(2023, 0, 15)
        const dateJuly2023 = new Date(2023, 6, 20)
        const mockDecisionLabel = {
          ...mockUtils.decisionTJMock,
          dateDecision: dateJanuary2023.toISOString(),
          dateCreation: dateJuly2023.toISOString()
        }
        // change with new condditions now this is before mise en service
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
      it('when decisionDate is in September 2022 and dateCreation is in March 2023', () => {
        // GIVEN
        const dateSeptember2022 = new Date(2022, 8, 20)
        const dateMarch2023 = new Date(2023, 2, 25)
        const mockDecisionLabel = {
          ...mockUtils.decisionTJMock,
          dateDecision: dateSeptember2022.toISOString(),
          dateCreation: dateMarch2023.toISOString()
        }
        const expectedLabelStatus = LabelStatus.IGNORED_DATE_AVANT_MISE_EN_SERVICE

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
      it('when originalText contains tibetan characters', () => {
        // GIVEN

        const mockDecisionLabel = {
          ...mockUtils.decisionTJMock,
          originalText:
            'la somme de 66. 224, 25 €, après imputation de la créance des tiers payeurs et déduction faite des provisions à hauteur de 9. 000 སྒྱ, en réparation de son préjudice corporel, consécutif à l’accident survenu le'
        }
        const expectedLabelStatus = LabelStatus.IGNORED_CARACTERE_INCONNU

        // WHEN
        mockDecisionLabel.labelStatus = computeLabelStatus(mockDecisionLabel)

        // THEN
        expect(mockDecisionLabel.labelStatus).toEqual(expectedLabelStatus)
      })
    })
  })
})
