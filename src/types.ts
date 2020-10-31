import WebPdEvalNode from "./EvalNode"

export type WebPdNode = WebPdEvalNode

export interface Engine {
    context: AudioContext
    node: WebPdNode | null
}

export type CompiledDspLoop = string