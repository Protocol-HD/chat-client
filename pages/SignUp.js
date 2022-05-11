import React from 'react';
import Image from 'next/image';
import userIcon from '../public/user.svg';
import axios from 'axios';
import Router from 'next/router';

function SignUp() {
    const createUserUrl = "/api/CreateUser.php";

    const signUp = () => {
        axios.post(createUserUrl, {
            email: document.getElementById("user-email").value,
            password: document.getElementById("user-password").value,
            nick_name: document.getElementById("user-nickname").value
        }).then(res => {
            if (res.data) {
                alert("회원가입 성공");
                Router.push({ pathname: `./` });
            }
        });
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-title'>회원가입</div>
                <div className='login-icon'>
                    <Image src={userIcon} width={"50px"} height={"50px"} />
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>이메일</div>
                    <input id="user-email" className='login-input' type='email'></input>
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>패스워드</div>
                    <input id="user-password" className='login-input' type='password'></input>
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>닉네임</div>
                    <input id="user-nickname" className='login-input'></input>
                </div>
                <button className='login-button' onClick={() => signUp()}>가입하기</button>
            </div>
        </div>
    );
}

export default SignUp;