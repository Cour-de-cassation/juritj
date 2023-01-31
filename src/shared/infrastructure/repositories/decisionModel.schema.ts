import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DecisionAssociee, Partie, President } from '../../domain/metadonnees'

@Schema()
export class DecisionModel {
  @Prop()
  decision: string

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
  chainage?: DecisionAssociee[]

  @Prop()
  decisionAssociee: DecisionAssociee

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

export const DecisionSchema = SchemaFactory.createForClass(DecisionModel)
