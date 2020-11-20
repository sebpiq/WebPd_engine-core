import * as evalEngine from '../../../src/eval-engine'

const context = new AudioContext()

const arraySize = 2056 * 64

const noiseArray = new Float32Array(arraySize)
for (let i = 0; i < arraySize; i++) {
    noiseArray[i] = Math.random() * 2 - 1
}

const sawtoothArray = new Float32Array(arraySize)
for (let i = 0; i < arraySize; i++) {
    sawtoothArray[i] = -1 + 2 * (i % 512) / 512
}

const eventPromise = (element: HTMLElement, event: string) => {
    return new Promise((resolve) => {
        const eventListener = () => {
            element.removeEventListener(event, eventListener)
            resolve()
        }
        element.addEventListener(event, eventListener)
    })
}

const createButton = (label: string) => {
    const button = document.createElement('button')
    button.innerHTML = label
    document.body.appendChild(button)
    return button
}

const main = async () => {
    let engine = await evalEngine.create(context, {
        sampleRate: context.sampleRate, 
        channelCount: 2,
    })

    const startButton = createButton('START')
    await eventPromise(startButton, 'click')

    engine = await evalEngine.init(engine)
    await evalEngine.run(engine, `
        const arraySize = ${arraySize}
        const arrays = {}

        let arrayIndex = 0
        let currentArray = new Float32Array(${arraySize})
        return {
            loop: () => {
                arrayIndex = (arrayIndex + 1) % arraySize
                return [currentArray[arrayIndex] * 0.1, currentArray[arrayIndex] * 0.1]
            },
            arrays,
            ports: {
                setArray: (arrayName) => currentArray = arrays[arrayName]
            }
        }
    `, {
        noise: noiseArray, 
        sawtooth: sawtoothArray
    })

    const setNoiseButton = createButton('Noise array')
    setNoiseButton.onclick = () => evalEngine.callPort(engine, 'setArray', ['noise'])
    const setPhasorButton = createButton('Phasor array')
    setPhasorButton.onclick = () => evalEngine.callPort(engine, 'setArray', ['sawtooth'])

    return engine
}

main().then((engine) => {
    console.log('app started')
    ;(window as any).webPdEngine = engine
})