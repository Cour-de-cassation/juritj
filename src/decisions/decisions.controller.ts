import { Controller, Post } from '@nestjs/common'

@Controller('decisions')
export class DecisionsController {
  @Post()
  collectDecisions(decisionFile) {
    return 200
  }
}
