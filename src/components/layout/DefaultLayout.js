import React, {Component} from 'react';
import {SwitchRouter} from '../index'
import {Container, Grid, Button} from '@material-ui/core';
import classnames from 'classnames';
import Header from "./Header";
import useStyles from "./styles";

function DefaultLayout({mainRoutes,history}) {
    let classes = useStyles();
    return <div className={classes.root}>
        <Header history={history}/>
        <div className={classnames(classes.content)}>
            <div className={classes.fakeToolbar}/>
            <Container component="main" maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <SwitchRouter routes={mainRoutes}/>
                    </Grid>
                </Grid>
            </Container>
        </div>
    </div>
}

export default DefaultLayout