/*
MIT License

Copyright 2023 Vinta

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { renderToString } from 'react-dom/server'
import { dim, blue, rainbow } from 'colors/safe'
import Home from '../../src/routes/+page'
import Env from '../../vinta-env'
import { readdirSync } from 'fs'
import Express from 'express'

export const expressApp = Express()
expressApp
    .use(Express.static('public'))
    .listen(Env.AddressPort)

const Routes = readdirSync(`${process.cwd()}/src/routes`).filter(route => !route.endsWith('tsx')).map(
    route => require(`../../src/routes/${route}`).default
)

expressApp.get('/', (_, res) => {
    return res.send(renderToString(Home()))
})

// @ts-ignore
for (const route of Routes) expressApp[route.method.toLowerCase()](route.name, (req, res) => {
    return route.execute(req, res)
})

console.clear()

console.log(`
    ${dim(new Date().toLocaleTimeString())} ${rainbow('Vinta')} ${dim('v2.1')}
    ⧽ Local: ${blue(`http://localhost:${Env.AddressPort}/`)}
    ⧽ Routes: ${dim(
        `${Routes.filter(route => route.method === 'GET').length} GET`
    )} - ${dim(
        `${Routes.filter(route => route.method === 'POST').length} POST`
    )}
`)