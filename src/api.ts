import { END_OF_COMMENT, promptify } from './constants'
import { CompletionConfig, CompletionResponse } from './types'

export const config = (functionText: string): CompletionConfig => ({
    url: 'https://api.openai.com/v1/completions',
    model: 'text-davinci-003',
    temperature: 0.680,
    max_tokens: 1024,
    top_p: 1,
    stop: ['*/'],
    prompt: promptify(functionText).replace(/\s+/g, '')
})

export async function fetchCompletion(config: CompletionConfig): Promise<string> {
    const { url, ...payload } = config
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`OpenAI API responded with ${response.status}: ${response.statusText}`)
        }

        const completion = await response.json<CompletionResponse>()
        return completion.choices[0].text.substring(1) + END_OF_COMMENT
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Failed to fetch completion: ${err.message}`)
        }

        throw err
    }
}
