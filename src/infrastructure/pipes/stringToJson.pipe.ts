import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class StringToJsonPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      throw new BadRequestException('Field is missing')
    }
    return JSON.parse(value)
  }
}
