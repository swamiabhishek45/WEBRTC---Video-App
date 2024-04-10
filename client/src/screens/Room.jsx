import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(email, id);
        setRemoteSocketId(id);
    });

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);

        return () => {
            socket.off("user:joined", handleUserJoined);
        };
    }, [socket, handleUserJoined]);

    return (
        <>
            <h1>Room</h1>
            <h4>{remoteSocketId ? "Connected": "No one in room"}</h4>
        </>
    );
};

export default Room;
