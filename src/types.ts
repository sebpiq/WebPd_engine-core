import WebPdEvalNode from "./EvalNode"

export type WebPdNode = WebPdEvalNode

export interface Engine {
    context: AudioContext
    node: WebPdNode | null
}

export interface EngineAttributes {
    sampleRate: number
    channelCount: number
    outputVariableNames: Array<string>
}

export type EvalDspLoop = string

export type EvalDspSetup = string