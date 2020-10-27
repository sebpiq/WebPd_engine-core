export type WebPdNode = AudioWorkletNode

export interface Engine {
    context: AudioContext
    node: WebPdNode | null
}