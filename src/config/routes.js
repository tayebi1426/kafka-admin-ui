import React from 'react'
import DefaultLayout from "../components/layout/DefaultLayout";

let kafkaClientList = React.lazy(() => import("../pages/KafkaClientList"));
//

const MAIN_ROUTES = [
    {path:'/clients',component:kafkaClientList}
];

const Layout = (props) => <DefaultLayout {...props} mainRoutes={MAIN_ROUTES}/>;

const APP_ROUTES = [
    {path: '/login', component: null},
    {path: '/404', component: null},
    {path: '/', exact: false, component: Layout}
];

export default APP_ROUTES;