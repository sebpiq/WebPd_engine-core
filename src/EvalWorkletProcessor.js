class EvalWorkletProcessor extends AudioWorkletProcessor {
    constructor(settings) {
        super()
        this.port.onmessage = this.onMessage.bind(this)
        const defaultOutput = new Float32Array(settings.channelCount)
        this.dspLoop = () => defaultOutput
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0]
        const blockSize = output[0].length
        for (let frame = 0; frame < blockSize; frame++) {
            const dspLoopResult = this.dspLoop()
            for (let channel = 0; channel < output.length; channel++) {
                output[channel][frame] = dspLoopResult[channel]
            }
        }
        return true
    }

    onMessage(message) {
        switch (message.data.type) {
            case 'DSP':
                globalThis.ARRAYS = message.data.payload.arrays
                this.setDsp(
                    message.data.payload.dspString,
                )
                break
            case 'PORT':
                this.callPort(
                    message.data.payload.portName,
                    message.data.payload.args
                )
                break
            default:
                new Error(`unknown message type ${message.type}`)
        }
    }

    setDsp(dspString) {
        const dsp = new Function(dspString)()
        this.dspLoop = dsp.loop
        this.dspPorts = dsp.ports
    }

    callPort(portName, args) {
        if (!this.dspPorts[portName]) {
            throw new Error(`Unknown port ${portName}`)
        }
        this.dspPorts[portName].apply(this, args)
    }
}

registerProcessor('webpd-eval-node', EvalWorkletProcessor)
