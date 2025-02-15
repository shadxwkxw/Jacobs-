import React from "react";
import cl from './check.module.css';

const Message = ({ message }) => {
    return (
        <div className={`${cl.message} ${message.isUser ? cl.userMessage : cl.botMessage}`}>
            {message.text && <p>{message.text}</p>}
            {message.file && (
                <div className={cl.fileInfo}>
                    <span>Прикрепленный файл: {message.file}</span>
                </div>
            )}
        </div>
    );
};

export default Message;