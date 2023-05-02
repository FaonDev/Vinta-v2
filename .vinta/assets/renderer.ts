import { bgRed, blue, green, grey, magenta, yellow } from 'colors/safe'
import { renderToString } from 'react-dom/server'
import Main from '../../src/routes/+page'
import Env from '../../vinta-env'
import { readdirSync } from 'fs'
import Express from 'express'

export const expressApp = Express()
expressApp.use(Express.static('public'))

expressApp.listen(Env.AddressPort)
// Change port if wanted.

const CacheMax = Env.RequestsPerMinute
let Cache = 0

expressApp.get('/', (req, res) => {
    Cache++
    setTimeout(() => Cache--, 60000)

    if (Cache >= CacheMax) {
        Cache === CacheMax && console.log(bgRed(`Requests limit exceeded at "${req.path}".`))
        return res.send('You\'re temporary blocked.')
    }

    res.send(renderToString(Main()))
})

const Routes = readdirSync(`${process.cwd()}/src/routes`).filter(route => !route.endsWith('tsx')).map(
    route => require(`../../src/routes/${route}`).default
)

for (const route of Routes) {
    // @ts-ignore
    expressApp[route.method.toLowerCase()](route.name, (req, res) => {
        Cache++
        setTimeout(() => Cache--, 10000)
    
        if (Cache >= CacheMax) {
            Cache === CacheMax && console.log(bgRed(`Requests limit exceeded at "${req.path}".`))
            return res.send('You\'re temporary blocked.')
        }

        route.execute(req, res)
    })
}

console.clear()

console.log(`
    ${grey(new Date().toLocaleTimeString())} ${magenta('Vinta v2.0')}
    > Local: ${blue(`http://localhost:${Env.AddressPort}/`)}
    > Routes: ${yellow(String(Routes.filter(route => route.method === 'GET').length))} ${green('GET')} / ${yellow(String(Routes.filter(route => route.method === 'POST').length))} ${green('POST')}
`)