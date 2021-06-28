import React, {useState} from 'react';
import {
    Avatar,
    Button,
    Grid,
    Box,
    Typography,
    Container,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    TextField
} from "@material-ui/core";

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from '@material-ui/core/styles';
import {useFormik} from "formik";
import SecurityService from "../services/SecurityService";
import {useSnackbar} from 'notistack';

import {Visibility, VisibilityOff} from "@material-ui/icons";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        width: "5rem",
        height: "5rem"
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        height: "3rem"
    },
}));

export default function Login({history}) {
    const classes = useStyles();
    const [loginErrorMessage, setLoginErrorMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {enqueueSnackbar} = useSnackbar();
    const formik = useFormik({
        initialValues: {username: 'Admin9', password: 'Admin@123'},
        onSubmit: (values, formikHelpers) => {

            setLoginErrorMessage(false)
            SecurityService.login(values).then(res => {

                if (res.status === 401) {
                    setLoginErrorMessage(true)
                } else {
                    enqueueSnackbar('Login Successful', {variant: "success"});
                    const token = btoa(values.username + ":" + values.password);
                    SecurityService.setAuthToken(token)
                    history.push('/acl')
                }
            }).catch(e => {
                console.log("exception > ", e)
            });

        }
    });
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h2">
                    Sign in
                </Typography>
                <div style={{minHeight: '5em'}}>
                    {loginErrorMessage &&
                    <h3 style={{color: '#FF5C93'}}>
                        Sorry, username or password is incorrect!
                    </h3>
                    }
                </div>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="off"
                        autoFocus
                        value={formik.values.username}
                        onChange={formik.handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"

                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        type={showPassword ? "text" : "password"}
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}

                                    >
                                        {showPassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={formik.handleSubmit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
