import { FileInterceptor } from '@nestjs/platform-express'
import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator
} from '@nestjs/common'

@Controller('decisions')
export class DecisionsController {
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('decisionIntegre'))
  collectDecisions(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'vnd.wordperfect' })]
      })
    )
    decisionIntegre: Express.Multer.File
  ) {
    /* TODO : poser un test avant de tirer le FileTypeValidator */

    console.log(decisionIntegre)
    return 202
  }
}
