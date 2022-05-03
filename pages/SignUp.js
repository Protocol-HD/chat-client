import React from 'react';
import Image from 'next/image';
import userIcon from '../public/user.svg'

function SignUp() {
    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-title'>회원가입</div>
                <div className='login-icon'>
                    <Image src={userIcon} width={"50px"} height={"50px"} />
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>이메일</div>
                    <input className='login-input' type='email'></input>
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>패스워드</div>
                    <input className='login-input' type='password'></input>
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>닉네임</div>
                    <input className='login-input'></input>
                </div>
                <button className='login-button'>가입하기</button>
            </div>
        </div>
    );
}

export default SignUp;