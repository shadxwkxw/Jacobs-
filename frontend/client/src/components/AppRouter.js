import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../routes";
import { LOGIN_ROUTE, CHECK_ROUTE} from "../utils/consts";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Context } from "..";

const AppRouter = () => {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    return (
        <Routes>
            {user ? (
                <>
                    {privateRoutes.map(({ path, Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                    <Route path="*" element={<Navigate to={CHECK_ROUTE}/>} />
                </>
            ) : (
                <>
                    {publicRoutes.map(({ path, Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                    <Route path="*" element={<Navigate to={LOGIN_ROUTE}/>} />
                </>
            )}
        </Routes>
    );
};

export default AppRouter;
