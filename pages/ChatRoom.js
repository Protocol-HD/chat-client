import React from 'react';
import { useEffect, useState } from 'react';
import socketio from 'socket.io-client';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import userIcon from '../public/user.svg';
import Router from 'next/router';

function ChatRoom(props) {
    const loginCheckUrl = "http://localhost:8081/api/LoginCheck.php";
    const messageCreateUrl = "http://localhost:8081/api/CreateMessages.php";
    const messageGetUrl = "http://localhost:8081/api/GetAllRoomMessages.php/?room=";
    const getRoomUserUrl = "http://localhost:8081/api/GetRoomUser.php/?room=";

    const [messageList, setMessageList] = useState([]);
    const [response, setResponse] = useState("");
    const [roomId, setRoomId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [users, setUsers] = useState([]);

    const router = useRouter();
    const socket = socketio.connect('http://localhost:8080', {
        transports: ['websocket'],
        cors: { origin: '*' }
    });

    const sendMessage = () => {
        if (localStorage.getItem('user-token') === null) {
            Router.push({ pathname: `./SignIn` });
            props.setLoginStatus(false);
        } else {
            axios.post(loginCheckUrl, {
                token: localStorage.getItem('user-token')
            }).then(res => {
                if (res.data === 0) {
                    Router.push({ pathname: `./SignIn` });
                    props.setLoginStatus(false);
                } else {
                    axios.post(messageCreateUrl, {
                        room_id: roomId,
                        send_user_id: res.data.id,
                        message_text: document.getElementById('send-input').value
                    }).then(res => {
                        if (res.data) {
                            socket.emit('ClientToServer',
                                {
                                    room: roomId,
                                    message: document.getElementById('send-input').value
                                }
                            );
                            document.getElementById('send-input').value = '';
                        }
                    })
                }
            })
        }
    }

    //     axios.post(messageCreateUrl, {
    //         room_id: roomId,
    //         send_user_id: 1,
    //         message_text: document.getElementById('send-input').value
    //     }).then(res => {
    //         if (res.data) {
    //             socket.emit('ClientToServer',
    //                 {
    //                     room: roomId,
    //                     message: document.getElementById('send-input').value
    //                 }
    //             );
    //             document.getElementById('send-input').value = '';
    //         }
    //     })
    // }

    // const joinRoom = () => {
    //     socket.emit('joinRoom', document.getElementById('join-test-input').value);
    // }

    // const leaveRoom = () => {
    //     socket.emit('leaveRoom', document.getElementById('join-test-input').value);
    // }

    useEffect(() => {
        if (localStorage.getItem('user-token') === null) {
            Router.push({ pathname: `./SignIn` });
            props.setLoginStatus(false);
        } else {
            axios.post(loginCheckUrl, {
                token: localStorage.getItem('user-token')
            }).then(res => {
                if (res.data === 0) {
                    Router.push({ pathname: `./SignIn` });
                    props.setLoginStatus(false);
                } else {
                    setUserId(res.data.id);
                    setRoomId(router.query.roomId);

                    axios.get(messageGetUrl + router.query.roomId).then(res => {
                        setMessageList(res.data);
                    });

                    axios.get(getRoomUserUrl + router.query.roomId).then(res => {
                        setUserId(res.data);
                        console.log(res.data);
                    });

                    socket.emit('joinRoom', router.query.roomId);

                    socket.on('ServerToClient', data => {
                        setResponse(data);
                        axios.get(messageGetUrl + router.query.roomId).then(res => {
                            setMessageList(res.data);
                        })
                    });
                }
            })
        }
    }, [])

    return (
        <div className="container chat-container">
            <div className='user-list-box'>
            
            </div>
            <div className='chat-box'>
                {
                    messageList.map((message, index) => (
                        message.send_user_id === userId ? (
                            <div key={index} className="message-right-box">
                                <div className="message-text-box">
                                    <div>
                                        <span className="message-send-time">{message.send_time}</span>
                                        <span className="message-user-id-right">{message.nick_name}</span>
                                    </div>
                                    <div className="message-text-right-box">
                                        <div className="message-text-right">{message.message_text}</div>
                                    </div>
                                </div>
                                <div className="message-icon"><Image src={userIcon} width={"50px"} height={"50px"} /></div>
                            </div>
                        ) : (
                            <div key={index} className="message-left-box">
                                <div className="message-icon"><Image src={userIcon} width={"50px"} height={"50px"} /></div>
                                <div className="message-text-box">
                                    <div>
                                        <span className="message-user-id-left">{message.nick_name}</span>
                                        <span className="message-send-time">{message.send_time}</span>
                                    </div>
                                    <div className="message-text-left">{message.message_text}</div>
                                </div>
                            </div>
                        )
                    ))
                }
                <div className="message-send-box">
                    <input id="send-input" className='send-input-box'></input>
                    <button className='send-button' onClick={() => sendMessage()}>send</button>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;