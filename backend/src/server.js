const { WebSocketServer } = require('ws')
require('dotenv').config();

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });

wss.on('connection', ws => {
    ws.on('error', console.error)

    ws.on('message', message => {
        wss.clients.forEach(client => client.send(message.toString()))
    })

    console.log('Client connected')
})
