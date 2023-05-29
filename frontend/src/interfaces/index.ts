export interface ISettings {
    model: string
    max_tokens: number
    temperature: number
    n: number
    stop: string
}

export interface IMessage {
    role: string
    content: string
}

export interface IPrompt {
    prompt?: string | string[] | null
    messages?: IMessage[] | null
    max_tokens: number
    temperature: number
    n: number
    stop?: string | string[] | null
}

export interface ICompletion {
    id: string
    object: string
    created: number
    model: string
    usage: IUsage
    choices: any[]
}

export interface IGPTChoice {
    message: IMessage
    finish_reason: string
    index: number
}

export interface IDavinciChoice {
    text: string
    index: number
    logprobs?: any | null
    finish_reason: string
}

export interface IUsage {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
}
