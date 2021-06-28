import './App.css';
import React, {Suspense} from "react";
import {SwitchRouter} from './components'
import appRoutes from './config/routes'
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from "@material-ui/styles";
import Themes from "./themes";
import {SnackbarProvider} from 'notistack';

function SuspenseFallback() {
    return <div>why!!!</div>
}

function App() {

    return <Suspense fallback={<SuspenseFallback/>}>
        <SnackbarProvider maxSnack={3}
                          preventDuplicate={true}
                          autoHideDuration={2000}
                          anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                          }}>
            <ThemeProvider theme={Themes.default}>
                <BrowserRouter>
                    <SwitchRouter routes={appRoutes}/>
                </BrowserRouter>
            </ThemeProvider>
        </SnackbarProvider>
    </Suspense>
}

export default App;
