import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Decision, Partie, President } from '../../../shared/domain/metadonnees'

@Schema()
export class Metadonnees {
  @Prop()
  idDecision: string

  @Prop()
  nomJuridiction: string

  @Prop()
  idJuridiction: string

  @Prop()
  codeJuridiction?: string

  @Prop()
  numeroRegistre: string

  @Prop()
  numeroRoleGeneral: string

  @Prop()
  numeroMesureInstruction: string

  @Prop()
  codeService: string

  @Prop()
  libelleService: string

  @Prop()
  dateDecision: string

  @Prop()
  codeDecision: string

  @Prop()
  libelleCodeDecision: string

  @Prop()
  president?: President

  @Prop()
  chainage?: Decision[]

  @Prop()
  decisionAssociee: Decision

  @Prop()
  parties: Partie[]

  @Prop()
  partie: Partie

  @Prop()
  sommaire?: string

  @Prop()
  codeNAC: string

  @Prop()
  libelleNAC: string

  @Prop()
  codeNature: string

  @Prop()
  libelleNature: string

  @Prop()
  public: boolean

  @Prop()
  recommandationOccultation: boolean

  @Prop()
  occultationComplementaire?: string
}

export const MetadonneesSchema = SchemaFactory.createForClass(Metadonnees)
