import {init, start} from '../../src/run-graph'

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
    let engine = await init(context)
    const button = document.createElement('button')
    button.innerHTML = 'START'
    document.body.appendChild(button)
    await eventPromise(button, 'click')
    engine = await start(engine)
    return engine
}

main().then((engine) => {
    console.log('app started')
    ;(window as any).webPdEngine = engine
})