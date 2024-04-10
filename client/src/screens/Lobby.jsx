import React, { useCallback, useState } from "react";

const Lobby = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const handleSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            console.log({ email, room });
        },
        [email, room]
    );
    return (
        <div>
            <h1>Lobby</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor="email">Email ID: </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <br />
                <label htmlFor="room">Room No: </label>
                <input
                    type="text"
                    id="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <br />
                <br />
                <button>Join</button>
            </form>
        </div>
    );
};

export default Lobby;
