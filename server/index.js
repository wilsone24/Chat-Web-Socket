import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import {pool} from './db.js'



const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app) /* Create http server */
const io = new Server(server) /* Create socket server */


io.on('connection',async (socket) => { /* when the socket receive a connection, then do this */
    console.log('a user has connected')

    socket.on('disconnect', () => { /* when the socket receive a disconnection, then do this */
        console.log('a user has disconnected')})

    socket.on('chat message',async (msg) => {
        await pool.query('INSERT INTO messages (content) VALUES (?)', msg)
        const [result] = await pool.query('SELECT * FROM messages')
        console.log(result)
        const [row] = await pool.query('SELECT LAST_INSERT_ID();')
        io.emit('chat message', msg, row[0]['LAST_INSERT_ID()'])
    })
    if (!socket.recovered){ 
        try {
            const [results] = await pool.query('SELECT * FROM messages WHERE id > ?', [socket.handshake.auth.serverOffset ?? 0]);
            results.forEach((item) => {
                socket.emit('chat message', item.CONTENT, item.id.toString())
            })
        } catch (e) {
           console.error(e) 
        }
    }
    
    
})

app.use(logger('dev')) /* Get info about the status of the server */


app.get('/', async (req, res) => {
/*     const [result] = await pool.query('SELECT * FROM messages')
    console.log(result) */
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => { /* Listen a specific port in local machine */ 
    console.log(`Server running at:${port}`)
})