import {load, init, run} from '../../src/run-graph'

const context = new AudioContext()

const eventPromise = (element: HTMLElement, event: string) => {
    return new Promise((resolve) => {
        const eventListener = () => {
            element.removeEventListener(event, eventListener)
            resolve()
        }
        element.addEventListener(event, eventListener)
    })
}

const main = async () => {
    let engine = await load(context)
    const button = document.createElement('button')
    button.innerHTML = 'START'
    document.body.appendChild(button)
    await eventPromise(button, 'click')
    engine = await init(engine)
    await run(engine, `
        const modFreq = 1
        const freqBase = 400
        const freqAmplitude = 20
        const J = 2 * Math.PI / ${engine.context.sampleRate}
        const phaseStepMod = J * modFreq

        let phaseMod = 0
        let phaseOsc = 0
        return () => { 
            phaseMod += phaseStepMod
            phaseOsc += J * (freqBase + freqAmplitude * Math.cos(phaseMod))
            return Math.cos(phaseOsc)
        }
    `)
    return engine
}

main().then((engine) => {
    console.log('app started')
    ;(window as any).webPdEngine = engine
})