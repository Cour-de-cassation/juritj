import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

@Injectable()
export class ValidateDtoPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors: ValidationError[] = await validate(object)
    if (errors.length > 0) {
      const messages = errors.map((err) => this.findPropertyNameInErrorMessage(err.toString(false)))
      throw new BadRequestException(
        'Une ou plusieurs erreurs ont été trouvées sur les propriétés suivantes : ' +
          messages.join(', ') +
          '.'
      )
    }
    return value
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }

  findPropertyNameInErrorMessage(message): string {
    const cleanMessage: RegExpExecArray = /property (.*?) /g.exec(message)
    /* exemple d'output du RegexExecArray 
        [
          'property dateDecision ',
          'dateDecision', <-- cette valeur nous intéresse
          index: 60,
          input: 'An instance of MetadonneesDto has failed the validation:\n' +
            ' - property dateDecision has failed the following constraints: isDateString, matches, isString \n',
          groups: undefined
        ]
    */
    return cleanMessage ? cleanMessage[1] : ''
  }
}
