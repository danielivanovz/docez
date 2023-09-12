export interface CompletionConfig {
    url: string
    prompt: string
    max_tokens?: number
    temperature?: number
    top_p?: number
    n?: number
    model?: string
    stop: ['*/']
}

export interface CompletionResponse {
    choices: Array<{ text: string }>
}

export type Replacement = { startPos: number; endPos: number; replacement: string }
