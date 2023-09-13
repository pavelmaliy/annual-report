import * as React from 'react';
import MainPage from "./components/MainPage";
import Login from "./components/login/Login";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {AppContext, AppContextProvider} from "./context/AppContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./storage/firebase";
import Register from "./components/login/Register";
import {useContext} from "react";


export default function App() {
    return (
        <AppContextProvider>
            <Bootstrap/>
        </AppContextProvider>
    );
}

function Bootstrap() {
    const {model, setModel} = useContext(AppContext);
    const [user, loading] = useAuthState(auth)
    if (loading) {
        return
    }

    if (user) {
        setModel({...model, user})
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route exact path="login" element={<Login/>}/>
                <Route exact path="register" element={<Register/>}/>
                <Route exact path="dashboard" element={user && user.emailVerified ? <MainPage/> : <Navigate to="/login" />}/>
            </Routes>
        </Router>
    );
}
