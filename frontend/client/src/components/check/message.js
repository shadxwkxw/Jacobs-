import React from "react";
import cl from './check.module.css';

const Message = ({ message }) => {
    const messageStyle = {
        backgroundColor: message.text.includes("Ошибка: Вы пытаетесь отправить конфиденциальную информацию. Пожалуйста, используйте защищенные каналы для передачи персональных данных.") 
            ? "#FFD3D6" 
            : "#E9FEEC",
        padding: "10px",
        borderRadius: "10px",
        margin: "5px 0",
    };

    return (
        <div 
            className={`${cl.message} ${message.isUser ? cl.userMessage : cl.botMessage}`}
            style={!message.isUser ? messageStyle : {}}
        >
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