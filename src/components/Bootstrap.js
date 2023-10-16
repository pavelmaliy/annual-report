import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../storage/firebase";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import Reset from "./login/Reset";
import EmailVerification from "./login/EmailVerification";
import MainPage from "./MainPage";
import * as React from "react";

export default function Bootstrap() {
    const [user] = useAuthState(auth)

    // validate today exchange rate exist
    // https://v6.exchangerate-api.com/v6/9d90a307165975a4b2958f79/latest/ILS

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route exact path="login" element={<Login/>}/>
                <Route exact path="register" element={<Register/>}/>
                <Route exact path="reset" element={<Reset/>}/>
                <Route path="verification" element={<EmailVerification/>}/>
                <Route exact path="dashboard" element={user && user.emailVerified ? <MainPage user={user.displayName}/> : <Navigate to={"/login"+ window.location.hash} />}/>
            </Routes>
        </Router>
    );
}