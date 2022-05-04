import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import userIcon from '../public/user.svg';
import axios from 'axios';
import Router from 'next/router';

function RoomList() {
    const roomListUrl = "http://localhost:8081/api/GetAllRoom.php";

    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        axios.get(roomListUrl).then(res => {
            setRoomList(res.data);
        });
    }, [])

    return (
        <div className="container">
            <div>채팅방 목록</div>
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
        </div>
    );
}

export default RoomList;