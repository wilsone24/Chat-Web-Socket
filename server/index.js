import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import {pool} from './db.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app) /* Create http server */
const io = new Server(server) /* Create socket server */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


io.on('connection',async (socket) => { /* when the socket receive a connection, then do this */
    console.log('a user has connected')

    socket.on('disconnect', () => { /* when the socket receive a disconnection, then do this */
        console.log('a user has disconnected')})

    socket.on('chat message',async (msg) => {
        const username = socket.handshake.auth.username ?? 'anonymous'
        await pool.query('INSERT INTO messages (content,username) VALUES (?, ?)', [msg, username])
        const [result] = await pool.query('SELECT * FROM messages')
        console.log(result)
        const [row] = await pool.query('SELECT LAST_INSERT_ID();')
        io.emit('chat message', msg, row[0]['LAST_INSERT_ID()'],username)
    })
    if (!socket.recovered){ 
        try {
            const [results] = await pool.query('SELECT * FROM messages WHERE id > ?', [socket.handshake.auth.serverOffset ?? 0]);
            results.forEach((item) => {
                socket.emit('chat message', item.content, item.id.toString(),item.username)
            })
        } catch (e) {
           console.error(e) 
        }
    }
    
    
})

app.use(logger('dev')) /* Get info about the status of the server */


app.get('/:usuario', (req, res) => {
    const usuario = req.params.usuario;
    res.render('index', { usuario: usuario });
})

server.listen(port, () => { /* Listen a specific port in local machine */ 
    console.log(`Server running at:${port}`)
})