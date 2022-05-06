import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import userIcon from '../public/user.svg';
import axios from 'axios';
import Router from 'next/router';

function RoomList(props) {
    const loginCheckUrl = "http://localhost:8081/api/LoginCheck.php";
    const roomListUrl = "http://localhost:8081/api/GetAllRoom.php";
    const createRoomUrl = "http://localhost:8081/api/CreateRoom.php";

    const [roomList, setRoomList] = useState([]);

    const createRoom = () => {
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
                    axios.post(createRoomUrl, {
                        owner_id: res.data.id,
                        name: document.getElementById("create-room-name").value
                    }).then(res => {
                        Router.push({
                            pathname: `./ChatRoom`,
                            query: { roomId: res.data }
                        })
                    })
                }
            })
        }
    }

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
                    axios.get(roomListUrl).then(res => {
                        setRoomList(res.data);
                    });
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
                        query: { roomId: room.id }
                    })}>
                        <div className='room-title'>
                            <Image src={userIcon} width={"50px"} height={"50px"} />
                            <div>{room.name}</div>
                        </div>
                        <div className='room-owner'>{room.nick_name}</div>
                        <div className='room-chat-time'>채팅 시간</div>
                        <div className='room-head-count'>인원수</div>
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