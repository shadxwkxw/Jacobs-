import React, { useState } from "react";
import cl from './check.module.css';
import fileIcon from "../../UI/Group.png";
import stroke from "../../UI/stroke.png";

const InputArea = ({ value, fileName, onTextChange, onFileChange, onSendMessage }) => {
    const handleFileInputClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className={cl.textareacontainer}>
            <div className={cl.textareaWrapper}>
                <textarea
                    className={cl.textarea}
                    placeholder="Напишите Ваш запрос..."
                    value={value}
                    onChange={onTextChange}
                />
                {fileName && (
                    <div className={cl.fileInfo}>
                        <span>Прикрепленный файл: {fileName}</span>
                    </div>
                )}
            </div>
            <img
                src={fileIcon}
                alt="attach file"
                className={cl.fileIcon}
                onClick={handleFileInputClick}
            />
            <img
                src={stroke}
                className={cl.stroke}
                onClick={onSendMessage}
            />
            <input
                type="file"
                id="fileInput"
                className={cl.fileInput}
                style={{ display: 'none' }}
                onChange={onFileChange}
            />
        </div>
    );
};

export default InputArea;