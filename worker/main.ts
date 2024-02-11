import { Webview } from 'webview-bun'

const workerURL = new URL('worker.ts', import.meta.url).href
const worker = new Worker(workerURL)

const webview = new Webview(true)
webview.title = 'Nitro'
webview.navigate('http://localhost:3000')
// webview.setHTML(`<html><body><h1>Loading...</h1></body></html>`)
webview.run()
worker.onmessage = (event) => {
  if (event.data.type === 'html') {
    console.log('worker message', event.data.html)

    webview.setHTML(event.data.html)
  }
}

