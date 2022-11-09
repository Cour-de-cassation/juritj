import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('decisions')
export class DecisionsController {
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('decisionIntegre'))
  collectDecisions(@UploadedFile() decisionIntegre: Express.Multer.File) {
    if (!decisionIntegre || !isWordperfectFileType(decisionIntegre)) {
      throw new BadRequestException('Provided file must be a wordperfect file.')
    }
    console.log(decisionIntegre)
    return 202
  }
}

function isWordperfectFileType(decisionIntegre: Express.Multer.File): boolean {
  const wordperfectMimeType = 'application/vnd.wordperfect'
  return decisionIntegre.mimetype === wordperfectMimeType
}
