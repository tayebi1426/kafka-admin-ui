import './App.css';
import React, {Suspense} from "react";
import {SwitchRouter} from './components'
import appRoutes from './config/routes'
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from "@material-ui/styles";
import Themes from "./themes";

function SuspenseFallback(){
    return <div>why!!!</div>
}
function App() {

    return <Suspense fallback={<SuspenseFallback/>}>
        <ThemeProvider theme={Themes.default}>
            <BrowserRouter>
                <SwitchRouter routes={appRoutes}/>
            </BrowserRouter>
        </ThemeProvider>
    </Suspense>
}

export default App;
