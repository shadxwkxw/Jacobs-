import { Component } from "react";
import { CHECK_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from "./utils/consts";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import Check from "./components/check/Check";

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Login
    }
]

export const privateRoutes = [
    {
        path: CHECK_ROUTE,
        Component: Check
    },

    {
        path: PROFILE_ROUTE,
        Component: Profile
    }
]