import { DecisionS3Repository } from '../../../shared/infrastructure/repositories/decisionS3.repository'

const s3Repository = new DecisionS3Repository()
const metadataStart = '"metadonnees":'

export async function getDecisionMetadonneesFromS3File(filename: string) {
  const result = await s3Repository.getDecisionByFilename(filename)
  extractMetadata(result.toString('utf-8'))
  /** next steps :  transformRawFile to a readable format
   * extract metadata
   **/
}
function extractMetadata(fileData: string) {
  const metadonnees = fileData.substring(fileData.indexOf(metadataStart))
  const parsedMetadonnnes = JSON.parse('{' + metadonnees)
  return parsedMetadonnnes
}
