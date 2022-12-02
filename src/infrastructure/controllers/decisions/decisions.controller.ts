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
  UsePipes
} from '@nestjs/common'
import {
  ApiTags,
  ApiBody,
  ApiConsumes,
  ApiAcceptedResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'

import { CollectDto } from './dto/collect.dto'
import { MetadonneesDto } from './dto/metadonnees.dto'
import { ValidateDtoPipe } from '../../pipes/validateDto.pipe'
import { StringToJsonPipe } from '../../pipes/stringToJson.pipe'
import { LoggingInterceptor } from '../../interceptors/logging.interceptor'
import { CustomLogger } from '../../utils/log.utils'
import { SaveDecisionUsecase } from '../../../usecase/saveDecision'
import { DecisionS3Repository } from 'src/infrastructure/repositories/decisionS3.repository'

@ApiTags('Collect')
@Controller('decisions')
export class DecisionsController {
  private readonly logger = new CustomLogger()

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Décision intègre au format wordperfect et metadonnées associées.',
    type: CollectDto
  })
  @ApiAcceptedResponse({ description: 'La requête a été acceptée et va être traitée.' })
  @ApiBadRequestResponse({
    description: "Le format des métadonnées est incorrect et/ou le fichier n'est pas au bon format."
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('decisionIntegre'), LoggingInterceptor)
  @UsePipes()
  async collectDecisions(
    @UploadedFile() decisionIntegre: Express.Multer.File,
    @Body('metadonnees', new StringToJsonPipe(), new ValidateDtoPipe())
    metadonneesDto: MetadonneesDto,
    @Req() request: Request
  ): Promise<MetadonneesDto> {
    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      const errorMessage = "Vous devez fournir un fichier 'decisionIntegre' au format Wordperfect."
      throw new BadRequestException(errorMessage)
    }
    const routePath = request.method + ' ' + request.path
    this.logger.log(
      routePath + ' returns ' + HttpStatus.ACCEPTED + ': ' + JSON.stringify(metadonneesDto)
    )

    const decisionsUseCase = new SaveDecisionUsecase(new DecisionS3Repository())
    await decisionsUseCase.execute(request, decisionIntegre).catch((error) => {
      this.logger.error(
        routePath + ' returns ' + error.getStatus() + ': ' + error.response.message.toString()
      )
      // TODO : throw une HTTP Error cohérente selon le type d'erreur
      throw error
    })

    // TODO : retourner un élément plus cohérent que metadonneesDto
    return metadonneesDto
  }
}

function isWordperfectFileType(decisionIntegre: Express.Multer.File): boolean {
  const wordperfectMimeType = 'application/vnd.wordperfect'
  return decisionIntegre.mimetype === wordperfectMimeType
}
