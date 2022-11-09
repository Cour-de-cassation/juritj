import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ValidateDtoPipe } from '../../pipes/validateDto.pipe'
import { StringToJsonPipe } from '../../pipes/stringToJson.pipe'
import { MetadonneesDto } from './dto/metadonnees.dto'

@Controller('decisions')
export class DecisionsController {
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('decisionIntegre'))
  @UsePipes()
  collectDecisions(
    @UploadedFile() decisionIntegre: Express.Multer.File,
    @Body('metadonnees', new StringToJsonPipe(), new ValidateDtoPipe())
    metadonneesDto: MetadonneesDto
  ) {
    /**
     * Idees :
     * 0. pouvoir parser la string en objet
     * 1. : parser via un pipe avant validation du dto : https://stackoverflow.com/questions/51782257/postman-form-data-sending-complex-object-with-file
     *
     */
    const metadonnees2: MetadonneesDto = metadonneesDto
    console.log(metadonnees2)
    console.log(metadonneesDto)

    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      throw new BadRequestException('Provided file must be a wordperfect file.')
    }
    return 202
  }
}

function isWordperfectFileType(decisionIntegre: Express.Multer.File): boolean {
  const wordperfectMimeType = 'application/vnd.wordperfect'
  return decisionIntegre.mimetype === wordperfectMimeType
}
