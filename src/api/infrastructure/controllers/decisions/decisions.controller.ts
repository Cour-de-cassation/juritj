import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes
} from '@nestjs/common'
import {
  ApiTags,
  ApiBody,
  ApiHeader,
  ApiConsumes,
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiServiceUnavailableResponse
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { SaveDecisionUsecase } from '../../../../api/usecase/saveDecision.usecase'
import { LoggingInterceptor } from '../../interceptors/logging.interceptor'
import { StringToJsonPipe } from '../../pipes/stringToJson.pipe'
import { ValidateDtoPipe } from '../../pipes/validateDto.pipe'
import { DecisionS3Repository } from '../../../../shared/infrastructure/repositories/decisionS3.repository'
import { CollectDto } from '../../../../shared/infrastructure/dto/collect.dto'
import { MetadonneesDto } from '../../../../shared/infrastructure/dto/metadonnees.dto'
import { BadFileFormatException } from '../../exceptions/badFileFormat.exception'
import { BucketError } from '../../../../shared/domain/errors/bucket.error'
import { InfrastructureExpection } from '../../../../shared/infrastructure/exceptions/infrastructure.exception'
import { UnexpectedException } from '../../../../shared/infrastructure/exceptions/unexpected.exception'
import { LogsFormat } from '../../../../shared/infrastructure/utils/logsFormat.utils'

export interface CollecteDecisionResponse {
  filename: string | void
  body: string
}

@ApiTags('Collect')
@Controller('decisions')
export class DecisionsController {
  private readonly logger = new Logger()

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'x-correlation-id',
    description: 'Identifiant de correlation'
  })
  @ApiBody({
    description: 'Décision intègre au format wordperfect et metadonnées associées.',
    type: CollectDto
  })
  @ApiAcceptedResponse({ description: 'La requête a été acceptée et va être traitée.' })
  @ApiBadRequestResponse({
    description: "Le format des métadonnées est incorrect et/ou le fichier n'est pas au bon format."
  })
  @ApiServiceUnavailableResponse({
    description: "Une erreur inattendue liée à une dépendance de l'API a été rencontrée. "
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('decisionIntegre'), LoggingInterceptor)
  @UsePipes()
  async collectDecisions(
    @UploadedFile() decisionIntegre: Express.Multer.File,
    @Body('metadonnees', new StringToJsonPipe(), new ValidateDtoPipe())
    metadonneesDto: MetadonneesDto,
    @Req() request: Request
  ): Promise<CollecteDecisionResponse> {
    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      throw new BadFileFormatException()
    }
    const routePath = request.method + ' ' + request.path

    const decisionUseCase = new SaveDecisionUsecase(new DecisionS3Repository(this.logger))
    const formatLogs: LogsFormat = {
      operationName: 'collectDecisions',
      httpMethod: request.method,
      path: request.path,
      msg: `Starting ${routePath}...`,
      correlationId: request.headers['x-correlation-id']
    }
    const filename = await decisionUseCase
      .execute(decisionIntegre, metadonneesDto)
      .catch((error) => {
        if (error instanceof BucketError) {
          this.logger.error({
            ...formatLogs,
            msg: error.message,
            statusCode: HttpStatus.SERVICE_UNAVAILABLE
          })
          throw new InfrastructureExpection(error.message)
        }
        this.logger.error({
          ...formatLogs,
          msg: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        })
        throw new UnexpectedException(error)
      })

    // Remove sensitive metadata before logging
    delete metadonneesDto['parties']
    delete metadonneesDto['president']
    delete metadonneesDto['sommaire']
    this.logger.log({
      ...formatLogs,
      msg: routePath + ' returns ' + HttpStatus.ACCEPTED,
      data: { decision: metadonneesDto },
      statusCode: HttpStatus.ACCEPTED
    })

    return { filename, body: 'Nous avons bien reçu la décision intègre et ses métadonnées.' }
  }
}

export function isWordperfectFileType(decisionIntegre: Express.Multer.File): boolean {
  const wordperfectMimeTypeValidValues = ['application/vnd.wordperfect', 'application/wordperfect']
  const wpdExtensionRegex = /\.wpd/gi
  return (
    wordperfectMimeTypeValidValues.includes(decisionIntegre.mimetype) &&
    wpdExtensionRegex.test(decisionIntegre.originalname)
  )
}
