import { Prop, Schema } from '@nestjs/mongoose'
import { MetadonneesNormalisee } from '../../domain/metadonnees'

@Schema()
export class DecisionModel {
  @Prop()
  decision: string

  @Prop()
  metadonnees: MetadonneesNormalisee
}
