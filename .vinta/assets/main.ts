/*
MIT License

Copyright 2023 Vinta

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const StartedAt = Date.now()

import { renderToString } from 'react-dom/server'
import Home from '../../src/routes/+page'
import { networkInterfaces } from 'os'
import Env from '../../vinta-env'
import { readdirSync } from 'fs'
import Express from 'express'
import 'colors'

export const expressApp = Express()

expressApp
    .use(Express.static('public'))
    .get('/', (_, res) => res.send(renderToString(Home())))
    .listen(Env._AddressPort)

const Routes = readdirSync(`${process.cwd()}/src/routes`).filter(
    route => !route.endsWith('tsx')
).map(
    route => require(`../../src/routes/${route}`).default
)

// @ts-ignore
for (const route of Routes) expressApp[route.method.toLowerCase()](route.name, (req, res) => {
    return route.execute(req, res)
})

// ---

console.clear()

console.log(`
    ${`VINTA v${Env._VintaVersion}`.inverse}  ${'ready in'.dim} ${Date.now() - StartedAt} ms
    ${'➜'.green}  ${'Local:'.bold}   ${`http://localhost:${Env._AddressPort}/`.blue}
    ${'➜'.yellow}  ${'Network:'.dim} ${Env._ExposeNetwork ? `http://${networkInterfaces().Ethernet?.[1].address}:${Env._AddressPort}/`.blue : `${'enable on'.grey} vinta-env ${'to expose'.grey}`}
`)

async function FetchVersion() {
    const Md = await (
        await fetch('https://raw.githubusercontent.com/FaonDev/Vinta-v2/master/.vinta/VERSION.md')
    ).text()

    if (Md !== String(Env._VintaVersion)) return console.log(`${`(vinta:${Env._VintaVersion})`.dim} OudatedWarning: Vinta v${Md} is now available.`)
}

FetchVersion()