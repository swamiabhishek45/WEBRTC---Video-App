const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors"); // userful to enable CORS

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Chal gaya hu mein");
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callended");
    });

    socket.io("calluser", ({ userToCall, signalData, from, name }) => {
        io.on(
            userToCall().emit("calluser", { signal: signalData, from, name })
        );
    });

    socket.io("answercall", (data) => {
        io.on(data.to).emit("callaccepted", data.signal);
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});

