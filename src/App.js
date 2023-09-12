import * as React from 'react';
import MainPage from "./components/MainPage";
import Login from "./components/login/Login";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {useContext} from "react";
import {AppContext, AppContextProvider} from "./context/AppContext";


export default function App() {
    return (
        <AppContextProvider>
            <Bootstrap/>
        </AppContextProvider>
    );
}

function Bootstrap() {
    const {data} = useContext(AppContext);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route exact path="login" element={<Login/>}/>
                <Route exact path="main" element={<MainPage/>}/>
            </Routes>
        </Router>
    );
}
