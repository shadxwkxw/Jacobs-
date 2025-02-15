import React, { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import { useAuthState } from "react-firebase-hooks/auth";
import cl from "./profile.module.css";
import { observer } from 'mobx-react-lite';

const Profile = observer(() => {
    const { auth } = useContext(Context);
    const [user] = useAuthState(auth);
    const [blocks, setBlocks] = useState([]);

    const totalRequests = blocks.length;
    const acceptedRequests = blocks.filter(block => block.rightText2 === "Принят").length;
    const blockedRequests = blocks.filter(block => block.rightText2 === "Заблокирован").length;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

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
    
    const addBlock = async (newBlock) => {
        try {
            setBlocks([...blocks, newBlock]);

            const response = await fetch("http://localhost:5000/api/blocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBlock),
            });

            if (!response.ok) {
                throw new Error("Ошибка при добавлении блока");
            }

            const data = await response.json();
            setBlocks((prevBlocks) =>
                prevBlocks.map((block) =>
                    block.id === newBlock.id ? { ...block, ...data } : block
                )
            );
        } catch (error) {
            console.error("Ошибка:", error);
            setBlocks(blocks.filter((block) => block.id !== newBlock.id));
        }
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
                <button className={cl.actionButton} onClick={() => auth.signOut()}>
                    Выйти
                </button>
            </div>
            <h1 className={cl.profileTitle}>История запросов</h1>
            {blocks.map((block) => (
                <div
                    key={block.id}
                    className={cl.blockedSection}
                    style={{
                        backgroundColor:
                            block.rightText2 === "Заблокирован"
                                ? "#FFD3D6"
                                : block.rightText2 === "Принят"
                                ? "#E9FEEC"
                                : "transparent"
                    }}
                >
                    <div className={cl.blockContent}>
                        <div className={cl.blockLeft}>
                            <p className={cl.blockCreatedAtl}>{formatDate(block.createdAt)}</p>
                        </div>
                        <div className={cl.blockCenter}>
                            <p className={cl.blockText}>{block.text}</p>
                        </div>
                        <div className={cl.blockRight}>
                            <p className={cl.blockRightText}>{block.rightText2}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default Profile;