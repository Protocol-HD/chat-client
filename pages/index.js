import { useEffect, useState } from 'react';
import socketio from 'socket.io-client';

export default function Home() {
    const [response, setResponse] = useState();

    useEffect(() => {
        const socket = socketio.connect('http://localhost:8080', {
            transports: ['websocket'],
            cors: { origin: '*' }
        });

        socket.on('ServerToClient', data => {
            setResponse(data);
        })
    }, [])


    return (
        <div>{response}</div>
    )
}
