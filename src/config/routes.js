import React from 'react'
import DefaultLayout from "../components/layout/DefaultLayout";

let SignIn = React.lazy(() => import("../pages/SignIn"));
let kafkaClientList = React.lazy(() => import("../pages/KafkaAclList"));
let AddAclEntry = React.lazy(() => import("../pages/AddAclEntry"));
//

const MAIN_ROUTES = [
    {path: '/acl/add', component: AddAclEntry},
    {path: '/acl',exact:true, component: kafkaClientList,authorities:['ADMIN']}
];

const Layout = (props) => <DefaultLayout {...props} mainRoutes={MAIN_ROUTES}/>;

const APP_ROUTES = [
    {path: '/login', component: SignIn},
    {path: '/404', component: null},
    {path: '/', exact: false, component: Layout}
];

export default APP_ROUTES;