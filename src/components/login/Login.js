import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Google, Visibility, VisibilityOff} from "@mui/icons-material";
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, logInWithEmailAndPassword, logInWithGoogle} from "../../storage/firebase";
import {Link, useNavigate} from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";

const defaultTheme = createTheme();

export default function SignIn() {
    const [user, loading, error] = useAuthState(auth);
    const [emailError, setEmailError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [userReady, setUserReady] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (user && user.emailVerified) {
                navigate("/dashboard" + window.location.hash);
            }
            setUserReady(true)
        }
    }, [user, loading]);


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email')
        let password = data.get('password')
        try {
            await logInWithEmailAndPassword(email, password)
        } catch (err) {
            setEmailError('invalid email or password')
        }
    };

    return (
        <div>
            {(!userReady) ? (
                <LoadingScreen/>
            ) : (
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                                <LockOutlinedIcon/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    error={!!emailError}
                                    helperText={emailError}
                                    autoComplete="email"
                                    onChange={(e) => {
                                        setEmailError('')
                                    }}
                                    autoFocus
                                />
                                <TextField
                                    id="password"
                                    name="password"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    startIcon={<Google/>}
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                    onClick={async () => {
                                        await logInWithGoogle()
                                    }}
                                >
                                    Login with Google
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link to={"/reset" + window.location.hash}>Forgot Password</Link>
                                    </Grid>
                                    <Grid item>
                                        <Link to={"/register" + window.location.hash}>
                                            Don't have an account? Sign Up
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            )}
        </div>
    );
}