/**
 * Spark Runtime API Type Definitions
 * These types define the globally available spark object
 */

export interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

export interface SparkKV {
  keys(): Promise<string[]>
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
}

export interface SparkRuntime {
  llmPrompt(strings: TemplateStringsArray, ...values: any[]): string
  llm(prompt: string, modelName?: string, jsonMode?: boolean): Promise<string>
  user(): Promise<UserInfo>
  kv: SparkKV
}

declare global {
  interface Window {
    spark: SparkRuntime
  }
}

export {}