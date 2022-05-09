import React from 'react';
import Image from 'next/image';
import github from '../public/github.png';
import Router from 'next/router';

function Footer() {
    return (
        <div className="footer-container">
            <div className='container'>
                <div className='footer-row'>
                    <div className='footer-column-2'>
                        <div className='center footer-column-2-column' onClick={() => Router.push({ pathname: `https://github.com/Protocol-HD/chat-client` })}>
                            <Image src={github} width={"50px"} height={"50px"} />
                            <p>chat-client</p>
                        </div>
                        <div className='center footer-column-2-column' onClick={() => Router.push({ pathname: `https://github.com/Protocol-HD/chat-server` })}>
                            <Image src={github} width={"50px"} height={"50px"} />
                            <p>chat-server</p>
                        </div>
                        <div className='center footer-column-2-column' onClick={() => Router.push({ pathname: `https://github.com/Protocol-HD/chat-php-api` })}>
                            <Image src={github} width={"50px"} height={"50px"} />
                            <p>chat-php-api</p>
                        </div>
                    </div>
                    <div className='footer-column-1'>
                        <div className='footer-column-1-left'>
                            <div>제작자:</div>
                            <div>E-mail:</div>
                            <div>Phone:</div>
                        </div>
                        <div className='footer-column-1-right'>
                            <div>Arthur</div>
                            <div>arthur@comets.kr</div>
                            <div>010-9911-2501</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Footer;