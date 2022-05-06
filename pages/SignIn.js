import React, { useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router';

function SignIn(props) {
    const loginUrl = "http://localhost:8081/api/Login.php";

    const login = () => {
        axios.post(loginUrl, {
            email: document.getElementById("user-email").value,
            password: document.getElementById("user-password").value
        }).then(res => {
            if (res.data) {
                localStorage.setItem("user-token", res.data);
                props.setLoginStatus(true);
                Router.push({ pathname: `./RoomList` });
            } else {
                alert("로그인 실패");
            }
        });
    }

    useEffect(() => {
        localStorage.removeItem('user-token');
        props.setLoginStatus(false);
    }, [])

    return (
        <div className='login-container'>
            <div className='sign-up-box'>
                <div className='login-title'>로그인</div>
                <div className='login-input-box'>
                    <div className='login-input-label'>이메일</div>
                    <input id="user-email" className='login-input' type='email'></input>
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>패스워드</div>
                    <input id="user-password" className='login-input' type='password'></input>
                </div>
                <button className='login-button' onClick={() => login()}>로그인</button>
                <div className='sign-up-description'>프로젝트에 처음 이신가요?
                    <Link href={'/SignUp'}>
                        <span>회원가입</span>
                    </Link>
                </div>
            </div>
        </div >
    );
}

export default SignIn;