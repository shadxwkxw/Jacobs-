import React, { useRef, useEffect } from "react";
import cl from './check.module.css';
import Message from "./message";

const ChatContainer = ({ messages }) => {
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div className={cl.chatContainer} ref={chatContainerRef}>
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    );
};

export default ChatContainer;