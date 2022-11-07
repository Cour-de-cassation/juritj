import { FileInterceptor } from '@nestjs/platform-express'
import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'

@Controller('decisions')
export class DecisionsController {
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('decisionIntegre'))
  collectDecisions(@UploadedFile() decisionIntegre: Express.Multer.File) {
    /* TODO : poser un test avant de tirer le FileTypeValidator 
      collectDecisions(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'vnd.wordperfect' }),
      ],
    })
  ) decisionIntegre: Express.Multer.File) {
    */
    console.log(decisionIntegre)
    // Todo : to improve with validators
    if (decisionIntegre === undefined) {
      throw new BadRequestException()
    }
    return 202
  }
}
