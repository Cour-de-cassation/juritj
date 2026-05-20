import { Router } from 'express'
import multer from 'multer'
import { parseMetadonnees } from '../services/decisions/models'
import { saveDecision } from '../services/decisions/handler'
import { BadFileFormat, BadFileSize, InfrastructureError, UnexpectedError } from '../services/error'
import { logger } from '../config/logger'

const FILE_MAX_SIZE = {
  size: 10000000,
  readSize: '10Mo'
} as const

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: FILE_MAX_SIZE.size }
})

const router = Router()

export interface CollecteDecisionResponse {
  filename: string | void
  body: string
}

function isWordperfectFileType(file: Express.Multer.File): boolean {
  const wordperfectMimeTypeValidValues = ['application/vnd.wordperfect', 'application/wordperfect']
  const wpdExtensionRegex = /\.wpd/gi
  return (
    wordperfectMimeTypeValidValues.includes(file.mimetype) &&
    wpdExtensionRegex.test(file.originalname)
  )
}

router.post('/v1/decisions', upload.single('decisionIntegre'), async (req, res, next) => {
  try {
    const decisionIntegre = req.file

    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      throw new BadFileFormat()
    }
    if (decisionIntegre.size >= FILE_MAX_SIZE.size) {
      throw new BadFileSize(FILE_MAX_SIZE.readSize)
    }

    const metadonneesRaw = req.body?.metadonnees
    if (!metadonneesRaw) {
      throw new BadFileFormat('Les métadonnées sont requises')
    }

    let metadonneesJson: unknown
    try {
      metadonneesJson =
        typeof metadonneesRaw === 'string' ? JSON.parse(metadonneesRaw) : metadonneesRaw
    } catch {
      throw new BadFileFormat('Les métadonnées doivent être un JSON valide')
    }

    const metadonnees = parseMetadonnees(metadonneesJson)

    const routePath = req.method + ' ' + req.path
    const formatLogs = {
      path: 'src/api/decisions.ts',
      operations: ['collect', 'decisions'] as const,
      message: JSON.stringify({
        httpMethod: req.method,
        path: req.path,
        msg: `Starting ${routePath}...`,
        correlationId: req.headers['x-correlation-id']
      })
    }
    logger.info(formatLogs)

    const filename = await saveDecision(decisionIntegre, metadonnees).catch((error) => {
      if (error instanceof InfrastructureError) {
        logger.error({
          ...formatLogs,
          message: JSON.stringify({ msg: error.message, statusCode: 503 }),
          stack: error.stack
        })
        throw error
      }
      logger.error({
        ...formatLogs,
        message: JSON.stringify({ msg: error.message, statusCode: 500 }),
        stack: error.stack
      })
      throw new UnexpectedError(error.message)
    })

    const metadonneesForLog = { ...metadonnees } as Record<string, unknown>
    delete metadonneesForLog['parties']
    delete metadonneesForLog['president']
    delete metadonneesForLog['sommaire']
    logger.info({
      ...formatLogs,
      message: JSON.stringify({
        msg: routePath + ' returns 202',
        data: { decision: metadonneesForLog },
        statusCode: 202
      })
    })

    res.status(202).json({
      filename,
      body: 'Nous avons bien reçu la décision intègre et ses métadonnées.'
    } satisfies CollecteDecisionResponse)
  } catch (err) {
    next(err)
  }
})

export default router
