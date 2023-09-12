declare namespace NodeJS {
    interface ProcessEnv {
        readonly OPENAI_API_KEY: string
        readonly HUGGINGFACE_API_KEY: string
    }
}