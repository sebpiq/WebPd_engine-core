import { CompiledDspLoop } from './types'

export default class WebPdEvalNode extends AudioWorkletNode {
    constructor(context: AudioContext) {
        super(context, 'webpd-eval-node')
    }
}

interface DspLoopMessage {
    type: 'DSP_LOOP'
    payload: CompiledDspLoop
}

export type EvalNodeMessage = DspLoopMessage