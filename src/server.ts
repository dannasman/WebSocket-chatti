import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

function createMessage(content: string, sender = 'NS'): string{
    return JSON.stringify(new Message(content, sender));
}

export class Message    {
    constructor(
        public content: string,
        public sender: string
    )   { }
}

wss.on('connection', (ws: WebSocket) => {

    ws.on('message', (msg: string) =>   {
        const message = JSON.parse(msg) as Message;
        wss.clients
        .forEach(client =>  {
            if(client != ws)    {
                client.send(createMessage(message.content, message.sender));
            }
        });
    });

    ws.send(createMessage('Sinulla on yhteys palvelimeen'))

    ws.on('error', (err) => {
        console.warn(`${err}`);
    });
});

server.listen(process.env.PORT || 8999, () =>   {
    console.log(`Palvelin auki portilla ${server.address().port}`);
});