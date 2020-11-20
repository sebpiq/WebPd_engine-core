import WebPdEvalNode from './EvalNode'

export type WebPdNode = WebPdEvalNode

export interface Engine {
    context: AudioContext
    node: WebPdNode | null
    settings: EngineAttributes
}

export interface EngineAttributes {
    sampleRate: number
    channelCount: number
}

export type EvalDspLoop = string

export type EvalDspSetup = string

export type EvalDsp = string