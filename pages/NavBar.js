import React, { useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router';

function NavBar(props) {
    const loginCheckUrl = "http://localhost:8081/api/LoginCheck.php";
    const refreshTokenUrl = "http://localhost:8081/api/RefreshToken.php";

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        props.setLoginStatus(false);
        Router.push({ pathname: `./` });
    }

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            props.setLoginStatus(false);
        } else {
            axios.post(loginCheckUrl, {
                access_token: localStorage.getItem('access_token')
            }).then(res => {
                if (res.data === -2) {
                    props.setLoginStatus(false);
                } else if (res.data === -1) {
                    axios.post(refreshTokenUrl, {
                        refresh_token: localStorage.getItem('refresh_token')
                    }).then(res => {
                        if (res.data !== -1 && res.data !== -2) {
                            localStorage.setItem("access_token", res.data.access_token);
                            localStorage.setItem("refresh_token", res.data.refresh_token);
                            props.setLoginStatus(true);
                        } else {
                            Router.push({ pathname: `./SignIn` });
                            props.setLoginStatus(false);
                        }
                    })
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