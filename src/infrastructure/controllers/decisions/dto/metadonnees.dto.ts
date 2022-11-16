import { IsString } from 'class-validator'

export class MetadonneesDto {
  @IsString()
  juridictionName: string
}
