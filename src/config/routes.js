import React from 'react'
import DefaultLayout from "../components/layout/DefaultLayout";

let kafkaClientList = React.lazy(() => import("../pages/KafkaClientList"));
let AddAclEntry = React.lazy(() => import("../pages/AddAclEntry"));
//

const MAIN_ROUTES = [
    {path: '/clients/AddAcl', component: AddAclEntry},
    {path: '/clients',exact:true, component: kafkaClientList}
];

const Layout = (props) => <DefaultLayout {...props} mainRoutes={MAIN_ROUTES}/>;

const APP_ROUTES = [
    {path: '/login', component: null},
    {path: '/404', component: null},
    {path: '/', exact: false, component: Layout}
];

export default APP_ROUTES;