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
    let node = new WebPdEvalNode(context)
    // TODO : why necessary?
    let kickStartOsc = context.createOscillator()
    kickStartOsc.frequency.value = 0
    kickStartOsc.connect(context.destination)
    kickStartOsc.start(0)
    node.connect(context.destination)
    kickStartOsc.disconnect()
    return {context, node}
}

export const run = async ({ node }: Engine, compiledDspLoop: CompiledDspLoop) => {
    node.port.postMessage({type: 'DSP_LOOP', payload: compiledDspLoop} as EvalNodeMessage)
}