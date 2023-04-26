import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Logger,
  UnauthorizedException
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
import { TLSSocket } from 'tls'
import { SaveDecisionUsecase } from '../../../../api/usecase/saveDecision.usecase'
import { LoggingInterceptor } from '../../interceptors/logging.interceptor'
import { StringToJsonPipe } from '../../pipes/stringToJson.pipe'
import { ValidateDtoPipe } from '../../pipes/validateDto.pipe'
import { DecisionS3Repository } from '../../../../shared/infrastructure/repositories/decisionS3.repository'
import { CollectDto } from '../../../../shared/infrastructure/dto/collect.dto'
import { MetadonneesDto } from '../../../../shared/infrastructure/dto/metadonnees.dto'

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
    validateClientCertificate(request)
    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      const errorMessage = "Vous devez fournir un fichier 'decisionIntegre' au format Wordperfect."
      throw new BadRequestException(errorMessage)
    }
    const routePath = request.method + ' ' + request.path

    this.logger.log(routePath + ' received with: ' + JSON.stringify(metadonneesDto))
    const decisionUseCase = new SaveDecisionUsecase(new DecisionS3Repository())
    const filename = await decisionUseCase
      .execute(decisionIntegre, metadonneesDto)
      .catch((error) => {
        this.logger.error(
          routePath + ' returns ' + error.getStatus() + ': ' + error.response.message.toString()
        )
        throw error
      })

    this.logger.log(filename + ' created in s3')
    this.logger.log(
      routePath + ' returns ' + HttpStatus.ACCEPTED + ': ' + JSON.stringify(metadonneesDto)
    )
    return { filename, body: 'Nous avons bien reçu la décision intègre et ses métadonnées.' }
  }
}

function isWordperfectFileType(decisionIntegre: Express.Multer.File): boolean {
  const wordperfectMimeType = 'application/vnd.wordperfect'
  const wpdExtensionRegex = /\.wpd/gi
  return (
    decisionIntegre.mimetype === wordperfectMimeType &&
    wpdExtensionRegex.test(decisionIntegre.originalname)
  )
}

function validateClientCertificate(request: Request): void {
  const socket = request.socket as TLSSocket
  if (socket.authorized === false) {
    throw new UnauthorizedException(socket.authorizationError)
  }
}
