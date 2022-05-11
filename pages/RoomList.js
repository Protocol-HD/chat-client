import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import userIcon from '../public/user.svg';
import axios from 'axios';
import Router from 'next/router';

function RoomList(props) {
    const loginCheckUrl = "/api/LoginCheck.php";
    const refreshTokenUrl = "/api/RefreshToken.php";
    const roomListUrl = "/api/GetAllRoom.php";
    const createRoomUrl = "/api/CreateRoom.php";
    const roomUserCountUrl = "/api/GetRoomUserCount.php";
    const roomChatTimeUrl = "/api/GetRoomChatTime.php";

    const [roomList, setRoomList] = useState([]);
    const [roomUserCount, setRoomUserCount] = useState([]);
    const [roomTime, setRoomTime] = useState([]);

    const create = (id) => {
        axios.post(createRoomUrl, {
            owner_id: id,
            name: document.getElementById("create-room-name").value
        }).then(res => {
            Router.push({
                pathname: `./ChatRoom`,
                query: {
                    roomId: res.data.id,
                    roomName: res.data.name,
                    roomOwner: res.data.owner_id
                }
            })
        })
    }

    const createRoom = () => {
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
                                create(res.data.id);
                            })
                        } else {
                            Router.push({ pathname: `./SignIn` });
                            props.setLoginStatus(false);
                        }
                    })
                } else {
                    create(res.data.id);
                }
            })
        }
    }

    const loadRoomList = () => {
        axios.get(roomListUrl).then(res => {
            setRoomList(res.data);
        });
        axios.get(roomUserCountUrl).then(res => {
            setRoomUserCount(res.data);
        });
        axios.get(roomChatTimeUrl).then(res => {
            setRoomTime(res.data);
        })
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
                            loadRoomList();
                        } else {
                            Router.push({ pathname: `./SignIn` });
                            props.setLoginStatus(false);
                        }
                    })
                } else {
                    loadRoomList();
                }
            })
        }
    }, [])

    return (
        <div className="container">
            <div className='chat-room-title-box'>
                <div className='chat-room-title'>채팅방 목록</div>
                <div className='chat-room-owner'>Owner</div>
                <div className='chat-room-chat-time'>채팅 시간</div>
                <div className='chat-room-head-count'>인원수</div>
            </div>
            {
                roomList.map(room => (
                    <div key={room.id} className='room-list-box' onClick={() => Router.push({
                        pathname: `./ChatRoom`,
                        query: {
                            roomId: room.id,
                            roomName: room.name,
                            roomOwner: room.user_id
                        }
                    })}>
                        <div className='room-title'>
                            <Image src={userIcon} width={"50px"} height={"50px"} />
                            <div>{room.name}</div>
                        </div>
                        <div className='room-owner center'>{room.nick_name}</div>
                        <div className='room-chat-time center'>{roomTime.find(item => item.room_id === room.id) === undefined ? "없음" : roomTime.find(item => item.room_id === room.id).time}</div>
                        <div className='room-head-count center'>{roomUserCount.find(item => item.room_id === room.id) === undefined ? 0 : roomUserCount.find(item => item.room_id === room.id).user_count}</div>
                    </div>
                ))
            }
            <div className='create-room-button-box'>
                <input id="create-room-name" className='create-room-input' />
                <button className='create-room-button' onClick={() => createRoom()}>방 만들기</button>
            </div>
        </div>
    );
}

export default RoomList;