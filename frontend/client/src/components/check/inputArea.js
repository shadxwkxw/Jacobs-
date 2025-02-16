import React, { useState } from "react";
import cl from './check.module.css';
import fileIcon from "../../UI/Group.png";
import stroke from "../../UI/stroke.png";
import mammoth from "mammoth";

const InputArea = ({ value, fileName, onTextChange, onFileChange, onSendMessage, setFileContent }) => {
    const handleFileInputClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileChange(event);

            const reader = new FileReader();
            reader.onload = (e) => {
                const arrayBuffer = e.target.result;

                mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                    .then(function (result) {
                        const text = result.value;
                        onTextChange({ target: { value: text } });
                        setFileContent(text);
                    })
                    .catch(function (error) {
                        console.error("Error parsing DOCX:", error);
                    });
            };
            reader.readAsArrayBuffer(file);
        } 
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
                onChange={handleFileChange}
            />
        </div>
    );
};

export default InputArea;