import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState, useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, sendPasswordReset} from "../../storage/firebase";
import {Link, useNavigate} from "react-router-dom";

const defaultTheme = createTheme();

export default function Reset() {
    const [user, loading, error] = useAuthState(auth);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading]);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email')
        try {
            await sendPasswordReset(email)
        } catch (err) {
            console.log(err.message)
            setEmailError('invalid email')
            return
        }
        navigate("/login");
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                       Forgot Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={email}
                            error={!!emailError}
                            helperText={emailError}
                            autoComplete="email"
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError('')
                            }}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/login">
                                    {"Back to Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}