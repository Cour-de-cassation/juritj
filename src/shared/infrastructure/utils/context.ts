import { AsyncLocalStorage } from 'async_hooks'
import { Injectable } from '@nestjs/common'

export type ContextData = Map<ContextKey, unknown>

export enum ContextKey {
  CORRELATION_ID = 'CORRELATION_ID'
}

@Injectable()
export class Context {
  private globalStorage: AsyncLocalStorage<ContextData>

  constructor() {
    this.globalStorage = new AsyncLocalStorage()
  }

  start(): void {
    this.globalStorage.enterWith(new Map<ContextKey, unknown>())
  }

  getCorrelationId(): string {
    return this.globalStorage.getStore()?.get(ContextKey.CORRELATION_ID) as string
  }

  setCorrelationId(correlationId: string): void {
    this.globalStorage.getStore()?.set(ContextKey.CORRELATION_ID, correlationId)
  }
}
