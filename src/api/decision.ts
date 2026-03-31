import { Router } from 'express'
import multer from 'multer'
import {
  isCustomError,
  MissingValue,
  NotSupported,
  BucketError,
  InfrastructureError,
  UnexpectedError
} from '../services/error'
import { parseMetadonnees, MetadonneesDto } from '../services/models'
import { saveDecision } from '../services/handler'
import { getDecisionList } from '../connectors/bucket'
import { checkDbConnection } from '../connectors/dbRawFile'
import { responseLog } from './logger'

const FILE_MAX_SIZE = {
  size: 10000000,
  readSize: '10Mo'
} as const

const app = Router()
const upload = multer()

function isWordperfectFileType(decisionIntegre: Express.Multer.File): boolean {
  const wordperfectMimeTypeValidValues = ['application/vnd.wordperfect', 'application/wordperfect']
  const wpdExtensionRegex = /\.wpd/gi
  return (
    wordperfectMimeTypeValidValues.includes(decisionIntegre.mimetype) &&
    wpdExtensionRegex.test(decisionIntegre.originalname)
  )
}

function parseFile(file: Express.Multer.File | undefined): Express.Multer.File {
  if (!file || !isWordperfectFileType(file)) {
    throw new NotSupported(
      'decisionIntegre',
      file?.mimetype,
      "Vous devez fournir un fichier 'decisionIntegre' au format Wordperfect."
    )
  }
  if (file.size >= FILE_MAX_SIZE.size) {
    throw new NotSupported(
      'decisionIntegre',
      file.size,
      `Vous devez fournir un fichier 'decisionIntegre' de moins de ${FILE_MAX_SIZE.readSize}.`
    )
  }
  return file
}

function parseBody(body: string | undefined): MetadonneesDto {
  if (!body) {
    throw new MissingValue('metadonnees', 'Vous devez fournir le champ: metadonnees')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch {
    throw new NotSupported('JSON', body, '"Le format JSON du champ metadonnees est invalide')
  }

  const result = parseMetadonnees(parsed)
  if (result instanceof Error) throw result

  return result
}

app.post('/decisions', upload.single('decisionIntegre'), async (req, res, next) => {
  try {
    const file = parseFile(req.file)
    const metadonnees = parseBody(req.body.metadonnees)

    const filename = await saveDecision(file, metadonnees).catch((error) => {
      if (error instanceof BucketError) {
        throw new InfrastructureError(error.message)
      }
      throw new UnexpectedError(error.message)
    })

    // Remove sensitive metadata before logging
    const metadonneesLog = { ...metadonnees }
    delete (metadonneesLog as any).parties
    delete (metadonneesLog as any).president
    delete (metadonneesLog as any).sommaire

    req.log.info({
      path: 'src/api/decision.ts',
      operations: ['collect', 'collectDecisions'],
      message: `POST /decisions returns 202`
    })

    res.status(202).send({
      filename,
      body: 'Nous avons bien reçu la décision intègre et ses métadonnées.'
    })
    return responseLog(req, res)
  } catch (err: unknown) {
    next(err)
  }
})

app.get('/health', async (_req, res, next) => {
  try {
    const bucketStatus = await getDecisionList()
      .then(() => ({ status: 'up' }))
      .catch(() => ({ status: 'down' }))

    const dbStatus = await checkDbConnection()
      .then(() => ({ status: 'up' }))
      .catch(() => ({ status: 'down' }))

    const allUp = bucketStatus.status === 'up' && dbStatus.status === 'up'
    const status = allUp ? 'ok' : 'error'
    const statusCode = allUp ? 200 : 503

    const details = { bucket: bucketStatus, db: dbStatus }
    const body = {
      status,
      info: allUp ? details : undefined,
      error: allUp ? undefined : details,
      details
    }

    res.status(statusCode).send(body)
  } catch (err: unknown) {
    next(err)
  }
})

export default app
