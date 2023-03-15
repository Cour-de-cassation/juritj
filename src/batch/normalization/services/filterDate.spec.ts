import { DecisionModel } from '../../../shared/infrastructure/repositories/decisionModel.schema'
import { MockUtils } from '../../../shared/infrastructure/utils/mock.utils'
import { mapDecisionNormaliseeToLabelDecision } from '../domain/decision.label.dto'
import { checkDecisionNormaliseeDateExactitude } from './filterDate'

describe('filter date function', () => {
  describe('checkDate function', () => {
    it('returns true if dateCreation is after dateDecision', () => {
      // GIVEN
      const mockDecision: DecisionModel = {
        decision: 'Le contenu WPD de ma decision',
        metadonnees: { ...new MockUtils().metadonneesDtoMock, dateDecision: '2010-11-21' }
      }
      // WHEN
      const decisionToSave = mapDecisionNormaliseeToLabelDecision(mockDecision)

      // THEN
      expect(checkDecisionNormaliseeDateExactitude(decisionToSave)).toBe(true)
    })

    it('returns false if dateCreation is before dateDecision', () => {
      // GIVEN
      const mockDecision: DecisionModel = {
        decision: 'Le contenu WPD de ma decision',
        metadonnees: { ...new MockUtils().metadonneesDtoMock, dateDecision: '2050-11-21' }
      }
      // WHEN
      const decisionToSave = mapDecisionNormaliseeToLabelDecision(mockDecision)

      // THEN
      expect(checkDecisionNormaliseeDateExactitude(decisionToSave)).toBe(false)
    })
  })
})
