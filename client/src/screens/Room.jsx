import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from '../service/peer';
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
        const offer = await peer.getOffer();
        socket.emit('user:call', {to: remoteSocketId, offer});

        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(({from, offer}) => {
        console.log(from, offer);
    }, [])

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
        };
    }, [socket, handleUserJoined, handleIncommingCall]);

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
