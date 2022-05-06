import '../styles/globals.css';
import NavBar from './NavBar';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
    const [loginStatus, setLoginStatus] = useState(false);

    return (
        <>
            <NavBar loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
            <Component {...pageProps} loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
        </>
    )
}

export default MyApp
