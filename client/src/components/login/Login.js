import React, { useContext } from 'react';
import { Context } from "../../index";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Button from "react-bootstrap/Button";
import cl from "./login.module.css";
import googleLogo from "../../UI/google.png";

const Login = () => {
    const { auth } = useContext(Context);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
        } catch (error) {
            console.error("Ошибка при входе:", error);
        }
    };

    return (
        <div>
            <div className={cl.google}>
                <h2>Вход</h2>
            </div>
            <div className={cl.googleButton}>
                <Button onClick={login}>
                    <img src={googleLogo} alt="Google Logo" style={{ width: "20px", marginRight: "10px" }}/>
                    Войти через Google
                </Button>
            </div>
        </div>
    );
};

export default Login;