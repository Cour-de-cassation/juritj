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
    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      throw new BadRequestException('Provided file must be a wordperfect file.')
    }
    return metadonneesDto
  }
}

function isWordperfectFileType(decisionIntegre: Express.Multer.File): boolean {
  const wordperfectMimeType = 'application/vnd.wordperfect'
  return decisionIntegre.mimetype === wordperfectMimeType
}
