import express from 'express'
import logger from 'morgan'
import { server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app) /* Create http server */


io.on('connection',() => { /* when the socket recieve a connection, then it do this */
    console.log('a user has connected')
})

app.use(logger('dev')) /* Get info about the status of the server */


app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => { /* Listen a specific port in local */
    console.log(`Server running at:${port}`)
})


