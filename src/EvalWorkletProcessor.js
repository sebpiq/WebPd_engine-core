class EvalWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
        super()
    }

    process(
        inputs,
        outputs,
        parameters,
    ) {
        const output = outputs[0]
        for (let channel = 0; channel < output.length; channel++) {
            const channelArray = output[channel]
            for (let i = 0; i < channelArray.length; i++) {
                channelArray[i] = Math.random()
            }
        }
        return true
    }
}

registerProcessor('webpd-eval-node', EvalWorkletProcessor)