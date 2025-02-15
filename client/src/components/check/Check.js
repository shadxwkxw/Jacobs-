import React, { useState, useContext } from "react";
import cl from './check.module.css';
import { Button } from "react-bootstrap";
import image from "../../UI/Vector.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../..";
import ChatContainer from "./chatContainer";
import InputArea from "./inputArea";

const Check = () => {
    const { auth } = useContext(Context);
    const [user] = useAuthState(auth);
    const [fileName, setFileName] = useState('');
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState([]);

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const sendMessage = async () => {
        if (!value.trim() && !fileName) return;

        const userMessage = {
            id: messages.length + 1,
            text: value,
            file: fileName,
            isUser: true,
        };
        setMessages([...messages, userMessage]);

        setValue('');
        setFileName('');

        try {
            const response = await fetch("http://localhost:5000/api/blocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    photoURL: user.photoURL,
                    email: user.email,
                    text: value,
                    rightText1: "Данные 1",
                    rightText2: "Данные 2",
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Данные успешно сохранены:", data);
            } else {
                console.error("Ошибка при сохранении данных");
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
        }

        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                text: "Это ответ от нейронной сети на ваше сообщение: " + value,
                isUser: false,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }, 1000);
    };

    return (
        <div>
            <div className={cl.container}>
                <Button className={cl.button} variant="success">
                    <img src={image} alt="icon" className={cl.icon} />
                    Новый чат
                </Button>
            </div>
            <div className={cl.textConteiner}>
                <p className={cl.title}>Интеллектуальная система фильтрации</p>
                <p className={cl.subtitle}>Проверьте запрос на содержание конфиденциальных данных</p>
            </div>

            <ChatContainer messages={messages} />

            <InputArea
                value={value}
                fileName={fileName}
                onTextChange={(e) => setValue(e.target.value)}
                onFileChange={handleFileInputChange}
                onSendMessage={sendMessage}
            />
        </div>
    );
};

export default Check;