import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(email, id);
        setRemoteSocketId(id);
    });

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        setMyStream(stream);
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);

        return () => {
            socket.off("user:joined", handleUserJoined);
        };
    }, [socket, handleUserJoined]);

    return (
        <>
            <h1>Room</h1>
            <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
            {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
            {myStream && (
                <>
                    <h1>My Stream</h1>
                    <ReactPlayer
                        playing
                        muted
                        height="300px"
                        width="300px"
                        url={myStream}
                    />
                </>
            )}
        </>
    );
};

export default Room;
