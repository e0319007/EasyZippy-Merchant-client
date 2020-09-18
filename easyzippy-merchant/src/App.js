import React, {useState} from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "./layouts/Admin.js";
import Login from "./views/Login.js"
import Error from "./views/Error.js"
import Apply from "./views/Apply.js"
import FileUpload from "./views/FileUpload.js";
import ForgotPassword from "./views/ForgotPassword.js";
import CheckValidToken from "./views/CheckValidToken.js";
import ResetPassword from "./views/ResetPassword.js";

const hist = createBrowserHistory();

function App(props) {
    console.log("initialising app")
    console.log("merchantusercookie: " + document.cookie.indexOf('merchantUser'))
    console.log("auth cookie: " + document.cookie.indexOf('authToken'))
    return (
        <Router history={hist}>
            <Switch>
                <Route exact path="/" component={Login} />
                {/* if user and token do not exist in the cookies */}
                {document.cookie.indexOf('merchantUser') === -1 && document.cookie.indexOf('authToken') === -1 &&
                    <Route path="/login" component={Login} />
                }
                {/* if user and token exists in the cookies */}
                { document.cookie.indexOf('merchantUser') > -1 && document.cookie.indexOf('authToken') > -1 && 
                    <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
                }
                <Route exact path="/error" component={Error} />
                <Route exact path="/apply" component={Apply}/>
                <Route exact path="/fileUpload" component={FileUpload}/>
                <Route exact path="/forgotPassword" component={ForgotPassword}/>
                <Route exact path="/checkValidToken" component={CheckValidToken}/>
                <Route exact path="/resetPassword" component={ResetPassword}/>
                {/* <Redirect to="/error" component={Error} /> */}
            </Switch>
        </Router>
    )
}

export default App;