import {
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
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('decisionIntegre'))
  collectDecisions(@UploadedFile() decisionFile: Express.Multer.File) {
    console.log(decisionFile)
    return 200
  }
}
