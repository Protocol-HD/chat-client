import React, { useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router';

function NavBar(props) {
    const loginCheckUrl = "http://localhost:8081/api/LoginCheck.php";

    const logout = () => {
        localStorage.removeItem('user-token');
        props.setLoginStatus(false);
        Router.push({ pathname: `./` });
    }

    useEffect(() => {
        if (localStorage.getItem('user-token') === null) {
            props.setLoginStatus(false);
        } else {
            axios.post(loginCheckUrl, {
                token: localStorage.getItem('user-token')
            }).then(res => {
                if (res.data === 0) {
                    props.setLoginStatus(false);
                } else {
                    props.setLoginStatus(true);
                }
            })
        }
    }, [props.loginStatus])

    return (
        <div className="navbar">
            <div className='navbar-container'>
                <div className='navbar-logo' onClick={() => Router.push({ pathname: './' })}>Arthur Chat</div>
                <div className='navber-menu'>
                    {
                        props.loginStatus ? (
                            <>
                                <Link href={'/RoomList'}>
                                    <div>Room list</div>
                                </Link>
                                <div onClick={() => logout()}>Logout</div>
                            </>
                        ) : (
                            <>
                                <Link href={'/SignUp'}>
                                    <div>Sign Up</div>
                                </Link>
                                <Link href={'/SignIn'}>
                                    <div>Sign In</div>
                                </Link>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default NavBar;