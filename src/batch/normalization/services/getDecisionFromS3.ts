import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

const S3Repository = new DecisionS3Repository()

export function getDecision(filename: string) {
  S3Repository.getDecisionByFilename(filename)
}
