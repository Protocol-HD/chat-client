import React from 'react';

function SignIn() {
    return (
        <div className='login-container'>
            <div className='sign-up-box'>
                <div className='login-title'>로그인</div>
                <div className='login-input-box'>
                    <div className='login-input-label'>이메일</div>
                    <input className='login-input' type='email'></input>
                </div>
                <div className='login-input-box'>
                    <div className='login-input-label'>패스워드</div>
                    <input className='login-input' type='password'></input>
                </div>
                <button className='login-button'>로그인</button>
                <div className='sign-up-description'>프로젝트에 처음 이신가요? <span>회원가입</span></div>
            </div>
        </div>
    );
}

export default SignIn;