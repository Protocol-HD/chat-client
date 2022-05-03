import React from 'react';
import { useEffect, useState } from 'react';
import socketio from 'socket.io-client';

function ChatRoom() {
    const [response, setResponse] = useState("");

    const socket = socketio.connect('http://localhost:8080', {
        transports: ['websocket'],
        cors: { origin: '*' }
    });

    useEffect(() => {
        socket.on('ServerToClient', data => {
            setResponse(data);
        })
    }, [])

    const sendMessage = () => {
        socket.emit('ClientToServer', document.getElementById('send-test-input').value);
        document.getElementById('send-test-input').value = '';
    }


    return (
        <>
            <div>{response}</div>
            <input id="send-test-input"></input>
            <button onClick={() => sendMessage()}>send</button>
        </>
    )
}

export default ChatRoom;