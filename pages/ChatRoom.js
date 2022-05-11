import React from 'react';
import { useEffect, useState } from 'react';
import socketio from 'socket.io-client';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import userIcon from '../public/user.svg';
import Router from 'next/router';

function ChatRoom(props) {
    const loginCheckUrl = "/api/LoginCheck.php";
    const messageCreateUrl = "/api/CreateMessages.php";
    const messageGetUrl = "/api/GetAllRoomMessages.php/?room=";
    const getRoomUserUrl = "/api/GetRoomUser.php/?room=";
    const deleteRoomUrl = "/api/DeleteRoom.php/?room=";
    const messageLimitUrl = "\&limit=";
    const refreshTokenUrl = "/api/RefreshToken.php";
    // const socketUrl = "http://gudehd.asuscomm.com:8080";
    const socketUrl = "http://localhost:8080";

    const [messageList, setMessageList] = useState([]);
    const [roomId, setRoomId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [users, setUsers] = useState([]);
    const [messageLimit, setMessageLimit] = useState(10);

    const router = useRouter();
    const socket = socketio.connect(socketUrl, {
        transports: ['websocket'],
        cors: { origin: '*' }
    });

    const send = (id) => {
        axios.post(messageCreateUrl, {
            room_id: roomId,
            send_user_id: id,
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
                axios.get(getRoomUserUrl + router.query.roomId).then(res => {
                    setUsers(res.data);
                });
            }
        })
    }

    const sendMessage = () => {
        if (document.getElementById('send-input').value !== "") {
            if (localStorage.getItem('access_token') === null) {
                Router.push({ pathname: `./SignIn` });
                props.setLoginStatus(false);
            } else {
                axios.post(loginCheckUrl, {
                    access_token: localStorage.getItem('access_token')
                }).then(res => {
                    if (res.data === -2) {
                        Router.push({ pathname: `./SignIn` });
                        props.setLoginStatus(false);
                    } else if (res.data === -1) {
                        axios.post(refreshTokenUrl, {
                            refresh_token: localStorage.getItem('refresh_token')
                        }).then(res => {
                            if (res.data !== -1 && res.data !== -2) {
                                localStorage.setItem("access_token", res.data.access_token);
                                localStorage.setItem("refresh_token", res.data.refresh_token);
                                axios.post(loginCheckUrl, {
                                    access_token: localStorage.getItem('access_token')
                                }).then(res => {
                                    send(res.data.id);
                                })
                            } else {
                                Router.push({ pathname: `./SignIn` });
                                props.setLoginStatus(false);
                            }
                        })
                    } else {
                        send(res.data.id);
                    }
                })
            }
        }
    }

    const del = (id) => {
        if (router.query.roomOwner === id) {
            if (window.confirm("정말 채팅방을 삭제하시겠습니까?")) {
                axios.delete(deleteRoomUrl + router.query.roomId).then(res => {
                    if (res.data) {
                        alert("삭제되었습니다");
                        Router.push({ pathname: `./RoomList` });
                    }
                });
            }
        }
    }

    const deleteRoom = () => {
        if (localStorage.getItem('access_token') === null) {
            Router.push({ pathname: `./SignIn` });
            props.setLoginStatus(false);
        } else {
            axios.post(loginCheckUrl, {
                access_token: localStorage.getItem('access_token')
            }).then(res => {
                if (res.data === -2) {
                    Router.push({ pathname: `./SignIn` });
                    props.setLoginStatus(false);
                }
                else if (res.data === -1) {
                    axios.post(refreshTokenUrl, {
                        refresh_token: localStorage.getItem('refresh_token')
                    }).then(res => {
                        if (res.data !== -1 && res.data !== -2) {
                            localStorage.setItem("access_token", res.data.access_token);
                            localStorage.setItem("refresh_token", res.data.refresh_token);
                            axios.post(loginCheckUrl, {
                                access_token: localStorage.getItem('access_token')
                            }).then(res => {
                                del(res.data.id);
                            });
                        } else {
                            Router.push({ pathname: `./SignIn` });
                            props.setLoginStatus(false);
                        }
                    })
                } else {
                    del(res.data.id);
                }
            })
        }
    }

    // const joinRoom = () => {
    //     socket.emit('joinRoom', document.getElementById('join-test-input').value);
    // }

    // const leaveRoom = () => {
    //     socket.emit('leaveRoom', document.getElementById('join-test-input').value);
    // }

    useEffect(() => {
        document.getElementById('chat-box-inner').addEventListener('scroll', () => {
            if (document.getElementById('chat-box-inner').scrollTop === 0) {
                setMessageLimit(messageLimit => messageLimit + 5);
            }
        });
    }, []);

    useEffect(() => {
        axios.get(messageGetUrl + router.query.roomId + messageLimitUrl + messageLimit).then(res => {
            setMessageList(res.data);
            document.getElementById('chat-box-inner').scrollTop = 1;
        })
    }, [messageLimit])

    const joinChatRoom = (id) => {
        setUserId(id);
        setRoomId(router.query.roomId);

        if (router.query.roomOwner !== id) {
            document.getElementById('room-delete-button').style.display = 'none';
        }

        axios.get(messageGetUrl + router.query.roomId + messageLimitUrl + messageLimit).then(res => {
            setMessageList(res.data);
        }).then(() => {
            document.getElementById('chat-box-inner').scrollTop = document.getElementById('chat-box-inner').scrollHeight;
        });

        axios.get(getRoomUserUrl + router.query.roomId).then(res => {
            setUsers(res.data);
        });

        socket.emit('joinRoom', router.query.roomId);

        socket.on('ServerToClient', data => {
            axios.get(messageGetUrl + router.query.roomId + messageLimitUrl + messageLimit).then(res => {
                setMessageList(res.data);
            }).then(() => {
                document.getElementById('chat-box-inner').scrollTop = document.getElementById('chat-box-inner').scrollHeight;
            });
        });
    }

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            Router.push({ pathname: `./SignIn` });
            props.setLoginStatus(false);
        } else {
            axios.post(loginCheckUrl, {
                access_token: localStorage.getItem('access_token')
            }).then(res => {
                if (res.data === -2) {
                    Router.push({ pathname: `./SignIn` });
                    props.setLoginStatus(false);
                } else if (res.data === -1) {
                    axios.post(refreshTokenUrl, {
                        refresh_token: localStorage.getItem('refresh_token')
                    }).then(res => {
                        if (res.data !== -1 && res.data !== -2) {
                            localStorage.setItem("access_token", res.data.access_token);
                            localStorage.setItem("refresh_token", res.data.refresh_token);
                            axios.post(loginCheckUrl, {
                                access_token: res.data.access_token
                            }).then(res => {
                                joinChatRoom(res.data.id);
                            })
                        } else {
                            Router.push({ pathname: `./SignIn` });
                            props.setLoginStatus(false);
                        }
                    })
                } else {
                    joinChatRoom(res.data.id);
                }
            })
        }
    }, [])



    return (
        <div className="container chat-container">
            <div className='user-list-box'>
                <div className='user-list-title'>참여자목록</div>
                {
                    users.map((user, index) => (
                        <div key={index} className="user-box">
                            <Image src={userIcon} width={"50px"} height={"50px"} />
                            <div className='user-box-name'>{user.nick_name}</div>
                            {
                                user.send_user_id === router.query.roomOwner ? <div className='user-owner'>OWNER</div> : ""
                            }
                        </div>
                    ))
                }
            </div>
            <div className='chat-box'>
                <div className='chat-box-header'>
                    <div className='chat-box-title'>{router.query.roomName}</div>
                    <div id='room-delete-button' className='room-delete-button'>
                        <button onClick={() => deleteRoom()}>방삭제</button>
                    </div>
                </div>
                <div id="chat-box-inner" className='chat-box-inner'>
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
                </div>
                <div className="message-send-box">
                    <input id="send-input" className='send-input-box'></input>
                    <button className='send-button' onClick={() => sendMessage()}>send</button>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;