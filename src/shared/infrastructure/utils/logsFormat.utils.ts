export type DecisionLog = {
  decision: {
    _id?: string
    sourceId: string
    sourceName: string
    publishStatus?: string
    labelStatus?: string
  }
  path: string
  operations: readonly ['collect' | 'extraction' | 'normalization', string]
  message?: string
}

export type TechLog = {
  path: string
  operations: readonly ['collect' | 'extraction' | 'normalization' | 'other', string]
  message?: string
}
