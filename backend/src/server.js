const { WebSocketServer } = require('ws');
require('dotenv').config();

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });

let users = [];

wss.on('connection', ws => {
    ws.on('error', console.error);

    ws.on('message', message => {
        const { type, userId, userName, userColor, content } = JSON.parse(message.toString());

        if (type === 'login') {
            users.push({ userId, userName, userColor });
            console.log(`${users.length} usuários conectados`);
        }

        if (type === 'logout') {
            ws.on('close', () => {
                users = users.filter(user => user.userId !== userId);
                console.log(`${users.length} usuários conectados`);
            });
        }

        if(type === 'users') { 
            const data = {
                type: 'users',
                users
            
            }
            ws.send(JSON.stringify(data));
            return;
        }

        const data = {
            type, userId, userName, userColor, content
        };

        wss.clients.forEach(client => client.send(JSON.stringify(data)));
    });
});
