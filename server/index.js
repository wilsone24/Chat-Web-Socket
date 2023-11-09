import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app) /* Create http server */
const io = new Server(server) /* Create socket server */


io.on('connection',(socket) => { /* when the socket receive a connection, then do this */
    console.log('a user has connected')

    socket.on('disconnect', () => { /* when the socket receive a disconnection, then do this */
        console.log('a user has disconnected')})

    socket.on('chat message',(msg) => {
        io.emit('chat message', msg) /* Send the message to all the sockets connected */
    })
})

app.use(logger('dev')) /* Get info about the status of the server */


app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => { /* Listen a specific port in local machine */
    console.log(`Server running at:${port}`)
})


