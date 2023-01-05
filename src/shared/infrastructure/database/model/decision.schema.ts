import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MetadonneesDto } from '../../dto/metadonnees.dto'

@Schema()
export class Decision {
  @Prop(MetadonneesDto)
  metadonnees: MetadonneesDto

  @Prop(String)
  decision: string
}

export const DecisionSchema = SchemaFactory.createForClass(Decision)
