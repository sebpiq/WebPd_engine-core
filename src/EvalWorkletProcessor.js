class EvalWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
        super()
        this.port.onmessage = this.onMessage.bind(this)
        this.dspLoop = () => {}
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0]
        const blockSize = output[0].length
        for (let frame = 0; frame < blockSize; frame++) {
            for (let channel = 0; channel < output.length; channel++) {
                output[channel][frame] = this.dspLoop()
            }
        }
        return true
    }

    onMessage(message) {
        switch (message.data.type) {
            case 'DSP_LOOP':
                this.setDspLoop(message.data.payload)
            default:
                new Error(`unknown message type ${message.type}`)
        }
    }

    setDspLoop(compiledDspLoop) {
        const dspLoopMaker = new Function(compiledDspLoop)
        this.dspLoop = dspLoopMaker()
    }
}

registerProcessor('webpd-eval-node', EvalWorkletProcessor)
