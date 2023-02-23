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
// import { Request } from 'express'
import { SaveDecisionUsecase } from '../../../../api/usecase/saveDecision.usecase'
import { LoggingInterceptor } from '../../interceptors/logging.interceptor'
import { StringToJsonPipe } from '../../pipes/stringToJson.pipe'
import { ValidateDtoPipe } from '../../pipes/validateDto.pipe'
import { DecisionS3Repository } from '../../../../shared/infrastructure/repositories/decisionS3.repository'
import { CollectDto } from '../../../../shared/infrastructure/dto/collect.dto'
import { MetadonneesDto } from '../../../../shared/infrastructure/dto/metadonnees.dto'

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
    @Req() request: any
  ): Promise<string> {
    if (!request.client.authorized) {
      const cert = request.socket.getPeerCertificate()
      if (cert.subject) {
        throw new UnauthorizedException('Invalid Client Certificate: ', cert.subject.CN)
      }
      throw new UnauthorizedException('You must provide a client certificate.')
    }

    // console.log({request})

    // console.log({path: request.path})
    // console.log({printClient: request.client.authorized})
    // console.log({printSocket: request.socket.getPeerCertificate()})

    const routePath = request.method + ' ' + request.path
    // console.log({routePath})

    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      const errorMessage = "Vous devez fournir un fichier 'decisionIntegre' au format Wordperfect."
      throw new BadRequestException(errorMessage)
    }

    this.logger.log(routePath + ' received with: ' + JSON.stringify(metadonneesDto))
    const decisionUseCase = new SaveDecisionUsecase(new DecisionS3Repository())
    await decisionUseCase.execute(decisionIntegre, metadonneesDto).catch((error) => {
      this.logger.error(
        routePath + ' returns ' + error.getStatus() + ': ' + error.response.message.toString()
      )
      throw error
    })

    this.logger.log(
      routePath + ' returns ' + HttpStatus.ACCEPTED + ': ' + JSON.stringify(metadonneesDto)
    )

    return 'Nous avons bien reçu la décision intègre et ses métadonnées.'
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
