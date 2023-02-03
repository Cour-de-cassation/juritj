import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MetadonneesNormalisee } from '../../domain/metadonnees'

@Schema()
export class DecisionModel {
  @Prop()
  decision: string

  @Prop()
  metadonnees: MetadonneesNormalisee
}

export const DecisionSchema = SchemaFactory.createForClass(DecisionModel)
