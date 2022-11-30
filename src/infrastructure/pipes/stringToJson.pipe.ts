import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class StringToJsonPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      throw new BadRequestException("Vous devez fournir le champ 'metadonnees'.")
    }
    try {
      return JSON.parse(value)
    } catch (error) {
      throw new BadRequestException("Le format JSON du champ 'metadonnees' est invalide.")
    }
  }
}
