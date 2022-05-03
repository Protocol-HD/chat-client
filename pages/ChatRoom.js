import React from 'react';
import { useEffect, useState } from 'react';
import socketio from 'socket.io-client';

function ChatRoom() {
    const [response, setResponse] = useState("");

    const socket = socketio.connect('http://localhost:8080', {
        transports: ['websocket'],
        cors: { origin: '*' }
    });

    const sendMessage = () => {
        socket.emit('ClientToServer', {
            room: document.getElementById('join-test-input').value,
            message: document.getElementById('send-test-input').value
        });
        document.getElementById('send-test-input').value = '';
    }

    const joinRoom = () => {
        socket.emit('createRoom', document.getElementById('join-test-input').value);
    }

    const leaveRoom = () => {
        socket.emit('leaveRoom', document.getElementById('join-test-input').value);
    }

    useEffect(() => {
        socket.on('ServerToClient', data => {
            setResponse(data);
        })
    }, [])


    return (
        <>
            <input id="join-test-input"></input>
            <button onClick={() => joinRoom()}>join</button>
            <button onClick={() => leaveRoom()}>leave</button>
            <div>{response}</div>
            <input id="room-test-input"></input>
            <input id="send-test-input"></input>
            <button onClick={() => sendMessage()}>send</button>
        </>
    )
}

export default ChatRoom;