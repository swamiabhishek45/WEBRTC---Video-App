import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";

export const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        // console.log(email, id);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });

        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            console.log("Incomming call", from, offer);
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            const ans = await peer.getAnswer(offer);
            socket.emit("call:accepted", { to: from, ans });
            setMyStream(stream);
        },
        [socket]
    );

    const handleCallAccepted = useCallback(
        async ({ from, ans }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted !!!");
            for (const track of myStream.getTracks()) {
                peer.peer.addTrack(track, myStream);
            }
        },
        [myStream]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = new peer.getOffer();
        socket.emit("peer:nogo:needed", { offer, to: remoteSocketId });
    }, [socket, remoteSocketId]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener(
                "negotiationneeded",
                handleNegoNeeded
            );
        };
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (e) => {
            const remoteStream = e.streams;
            setRemoteStream(remoteStream);
        });
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
        };
    }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

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
            {remoteStream && (
                <>
                    <h1>Remote Stream</h1>
                    <ReactPlayer
                        playing
                        muted
                        height="300px"
                        width="300px"
                        url={remoteStream}
                    />
                </>
            )}
        </>
    );
};
