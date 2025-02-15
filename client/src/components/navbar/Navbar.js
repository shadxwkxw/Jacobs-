import React from "react";
import cl from './navbar.module.css';
import logo from '../../UI/logo.png';
import { NavLink } from "react-router-dom";
import { CHECK_ROUTE, PROFILE_ROUTE} from "../../utils/consts";

const Navbar = () => {
    return (
        <div className={cl.navbar}>
            <img src={logo} style={{width: 32, height: 32}}/>
            <div className={cl.navbar__link}>
                <NavLink className={cl.navbar__links} to={CHECK_ROUTE}>ПРОВЕРИТЬ ЗАПРОС</NavLink>
                <NavLink className={cl.navbar__links} to={PROFILE_ROUTE}>ЛИЧНЫЙ КАБИНЕТ</NavLink>
            </div>
        </div>
    );
};

export default Navbar;