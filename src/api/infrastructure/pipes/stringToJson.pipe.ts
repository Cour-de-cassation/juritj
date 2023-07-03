import { Injectable, PipeTransform } from '@nestjs/common'
import { MissingFieldException } from '../exceptions/missingField.exception'
import { BadFieldFormatException } from '../exceptions/badFieldFormat.exception'

@Injectable()
export class StringToJsonPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      throw new MissingFieldException('metadonnees')
    }
    try {
      return JSON.parse(value)
    } catch (error) {
      throw new BadFieldFormatException('JSON', 'metadonnees')
    }
  }
}
