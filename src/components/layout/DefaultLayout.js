import React, {Component} from 'react';
import {SwitchRouter} from '../index'
import {Container, Grid, Button} from '@material-ui/core';
import classnames from 'classnames';
import Header from "./Header";
import useStyles from "./styles";

function DefaultLayout({mainRoutes}) {
    let classes = useStyles();
    return <div className={classes.root}>
        <Header/>
        <div className={classnames(classes.content)}>
            <div className={classes.fakeToolbar}/>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <SwitchRouter routes={mainRoutes}/>
                    </Grid>
                </Grid>
            </Container>
        </div>
    </div>
}

export default DefaultLayout