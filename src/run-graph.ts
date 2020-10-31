import '@webpd/shared/types/WebAudioAPI'
import evalProcessorJs from 'raw-loader!./EvalWorkletProcessor.js'
import WebPdEvalNode, { EvalNodeMessage } from './EvalNode'
import { CompiledDspLoop, Engine } from './types'
 
export const load = async (context: AudioContext): Promise<Engine> => {
    const blob = new Blob([evalProcessorJs], { type : 'text/javascript' })
    const processorUrl = URL.createObjectURL(blob)
    await context.audioWorklet.addModule(processorUrl)
    return {context, node: null}
}

export const init = async ({context}: Readonly<Engine>): Promise<Engine> => {
    // https://github.com/WebAudio/web-audio-api/issues/345
    if (context.state === 'suspended') {
        context.resume()
    }

    let node = new WebPdEvalNode(context)
    node.connect(context.destination)
    return {context, node}
}

export const run = async ({ node }: Engine, compiledDspLoop: CompiledDspLoop) => {
    node.port.postMessage({type: 'DSP_LOOP', payload: compiledDspLoop} as EvalNodeMessage)
}