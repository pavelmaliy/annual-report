import * as React from 'react';
import {useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../storage/firebase";
import {Link, useNavigate, useParams} from "react-router-dom";

const defaultTheme = createTheme();

export default function EmailVerification() {
    const { email } = useParams();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading]);
    return (
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
                    <Typography component="h1" variant="h5" align="center" fullWidth>
                        We've sent a verification email to:
                    </Typography>
                    <Typography component="h1" variant="h5" align="center">
                        {email}
                    </Typography>
                    <Box noValidate sx={{mt: 1}}>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/login">After verifying your email login</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}