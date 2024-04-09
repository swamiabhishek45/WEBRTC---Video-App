const {Server}  = require('socket.io');

const io = new Server(8000);

io.on('connection', (socket) => {
    socket.emit("me", socket.id);

    console.log('Socket connected', socket.id);
})