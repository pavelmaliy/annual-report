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
import {Link, useNavigate} from "react-router-dom";
import {Google, Visibility, VisibilityOff} from "@mui/icons-material";
import {auth, logInWithGoogle, registerWithEmailAndPassword} from "../../storage/firebase";
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {useAuthState} from "react-firebase-hooks/auth";
import LoadingScreen from "../common/LoadingScreen";
const defaultTheme = createTheme();

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [userReady, setUserReady] = useState(false)
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (!loading) {
            if (user && user.emailVerified) {
                navigate("/dashboard" + window.location.hash);
            }
            setUserReady(true)
        }
    }, [user, loading]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const data = new FormData(event.currentTarget);
        let email = data.get('email')
        let password = data.get('password')
        let firstName = data.get('firstName')
        let lastName = data.get('lastName')

        let validationError = false
        if (password.length < 6) {
            setPasswordError('password should be at least 6 characters')
            validationError = true
        }
        if (email.length === 0 || !emailRegex.test(email)) {
            setEmailError('invalid email')
            validationError = true
        }
        if (firstName.length === 0) {
            setFirstNameError('cannot be empty')
            validationError = true
        }
        if (lastName.length === 0) {
            setLastNameError('cannot be empty')
            validationError = true
        }

        if (validationError) {
            return
        }

        try {
            await registerWithEmailAndPassword(firstName + " " + lastName, email, password)
        } catch (e) {
            if (e.toString().includes('email-already-in-use')) {
                setEmailError('email already in use')
                return
            }
            throw e
        }

        let mailState = {email}
        navigate('/verification', {state: mailState});
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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
                                Sign up
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="firstName"
                                            error={!!firstNameError}
                                            helperText={firstNameError}
                                            onChange={(e) => {
                                                setFirstNameError('')
                                            }}
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            error={!!lastNameError}
                                            helperText={lastNameError}
                                            onChange={(e) => {
                                                setLastNameError('')
                                            }}
                                            autoComplete="family-name"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            error={!!emailError}
                                            helperText={emailError}
                                            onChange={(e) => {
                                                setEmailError('')
                                            }}
                                            autoComplete="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="password"
                                            name="password"
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="password"
                                            error={!!passwordError}
                                            helperText={passwordError}
                                            onChange={(e) => {
                                                setPasswordError('')
                                            }}
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
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    Sign Up
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
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link to={"/login" + window.location.hash}>
                                            {" Already have an account? Sign in"}
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