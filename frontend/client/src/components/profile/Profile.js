import React, { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import { useAuthState } from "react-firebase-hooks/auth";
import cl from "./profile.module.css";
import { observer } from 'mobx-react-lite';

const Profile = observer(() => {
    const { auth } = useContext(Context);
    const [user] = useAuthState(auth);
    const [blocks, setBlocks] = useState([]);
    const [error, setError] = useState("");

    const totalRequests = blocks.length;
    const acceptedRequests = blocks.filter(block => block.rightText2 === "Принято").length;
    const blockedRequests = blocks.filter(block => block.rightText2 === "Заблокировано").length;

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/blocks");
                const data = await response.json();
                setBlocks(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };
        fetchBlocks();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Ошибка загрузки");
            }

            const updatedResponse = await fetch("http://localhost:5000/api/blocks");
            const updatedData = await updatedResponse.json();
            setBlocks(updatedData);
            setError("");

        } catch (err) {
            setError(err.message);
            console.error("Ошибка:", err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className={cl.profileContainer}>
            <div className={cl.profileHeader}>
                <h1 className={cl.profileTitle}>Личный кабинет</h1>
                <div className={cl.avatarBlock}>
                    <img className={cl.avatar} src={user.photoURL} alt="Аватар" />
                </div>
            </div>
            <div className={cl.profileInfo}>
                <h2 className={cl.profileName}>{user.email}</h2>
                <div className={cl.stats}>
                    <div className={cl.statItem1}>
                        <span className={cl.statLabel}>Всего</span>
                        <span className={cl.statValue}>{totalRequests}</span>
                    </div>
                    <div className={cl.statItem2}>
                        <span className={cl.statLabel}>Принято</span>
                        <span className={cl.statValue}>{acceptedRequests}</span>
                    </div>
                    <div className={cl.statItem3}>
                        <span className={cl.statLabel}>Заблокировано</span>
                        <span className={cl.statValue}>{blockedRequests}</span>
                    </div>
                </div>
            </div>
            <div className={cl.actions}>
            <label className={cl.uploadButton}>
                    <input
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                        accept=".pdf,.docx"
                    />
                </label>
                <button className={cl.actionButton} onClick={() => auth.signOut()}>
                    Выйти
                </button>
            </div>
            {error && <div className={cl.error}>{error}</div>}
            <h1 className={cl.profileTitle}>История запросов</h1>
            {blocks.map((block) => (
                <div
                    key={block.id}
                    className={cl.blockedSection}
                    style={{
                        backgroundColor: block.rightText2 === "Заблокировано" ? "#FFD3D6" : "#E9FEEC",
                    }}
                >
                    <p className={cl.statValue}>{formatDate(block.createdAt)}</p>
                    <p className={cl.statText}>{block.text}</p>
                    <p className={cl.statLabel}>{block.rightText2}</p>
                </div>
            ))}
        </div>
    );
});

export default Profile;