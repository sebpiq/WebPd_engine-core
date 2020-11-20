import '@webpd/shared/types/WebAudioAPI'
import evalProcessorJs from 'raw-loader!./EvalWorkletProcessor.js'
import WebPdEvalNode, { EvalNodeMessage } from './EvalNode'
import { Engine, EngineAttributes, EvalDsp } from './types'

export const create = async (context: AudioContext, engineAttributes: EngineAttributes): Promise<Engine> => {
    const blob = new Blob([evalProcessorJs], { type: 'text/javascript' })
    const processorUrl = URL.createObjectURL(blob)
    await context.audioWorklet.addModule(processorUrl)
    return { context, node: null, settings: engineAttributes }
}

export const init = async ({ context, settings }: Readonly<Engine>): Promise<Engine> => {
    // https://github.com/WebAudio/web-audio-api/issues/345
    if (context.state === 'suspended') {
        context.resume()
    }

    let node = new WebPdEvalNode(context, settings.channelCount)
    node.connect(context.destination)
    return { context, node, settings }
}

export const run = async ({ node }: Engine, dspString: EvalDsp, arrays: PdDspGraph.Arrays) => {
    const message: EvalNodeMessage = {
        type: 'DSP',
        payload: {
            dspString, arrays
        },
    }
    node.port.postMessage(message)
}

export const callPort = async ({ node }: Engine, portName: string, args: Array<any>) => {
    const message: EvalNodeMessage = {
        type: 'PORT',
        payload: {
            portName, args
        },
    }
    node.port.postMessage(message)
}