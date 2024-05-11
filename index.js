const express = require('express')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const serverless = require('serverless-http');

const router = express.Router()
const app = express();
const server = createServer(app);
const io = new Server(server);

router.get('/', (req, res) => {
res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    const ipAddress = socket.handshake.address;
    console.log(`Log: Usuário Conectado. Ip: ${ipAddress}`);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });


app.use("/.netlify/functions/index", router);

server.listen(3000, () => {
  console.log('server running at port 3000');
});

module.exports.handler = serverless(app);