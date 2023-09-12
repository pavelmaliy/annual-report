import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, logInWithGoogle } from "../../storage/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import {AppContext} from "../../context/AppContext"
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();


    useEffect(() => {
        console.log("in login user:" + JSON.stringify(user) + "loading is " + loading)
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading]);
    return (
        <div className="login">
            <div className="login__container">
                <input
                    type="text"
                    className="login__textBox"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Address"
                />
                <input
                    type="password"
                    className="login__textBox"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    className="login__btn"
                    onClick={() => logInWithEmailAndPassword(email, password)}
                >
                    Login
                </button>
                <button className="login__btn login__google" onClick={async () => {
                    await logInWithGoogle()
                }}>
                    Login with Google
                </button>
               {/* <div>
                    <Link to="/reset">Forgot Password</Link>
                </div>*/}
                {/*<div>
                    Don't have an account? <Link to="/register">Register</Link> now.
                </div>*/}
            </div>
        </div>
    );
}
export default Login;