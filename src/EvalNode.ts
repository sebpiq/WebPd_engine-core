import { EvalDsp } from './types'

export default class WebPdEvalNode extends AudioWorkletNode {
    constructor(context: AudioContext, channelCount: number) {
        super(context, 'webpd-eval-node', { channelCount: channelCount })
    }
}

export const ENGINE_ARRAYS_VARIABLE_NAME = 'ARRAYS'

interface SetDspMessage {
    type: 'DSP'
    payload: {
        dspString: EvalDsp
        arrays: PdDspGraph.Arrays
    }
}

interface CallPortMessage {
    type: 'PORT'
    payload: {
        portName: string
        args: Array<any>
    }
}

export type EvalNodeMessage = SetDspMessage | CallPortMessage
