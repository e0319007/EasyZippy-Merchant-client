import React, {useState} from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "./layouts/Admin.js";
import Login from "./views/User/Login.js"
import Error from "./views/Error.js"
import Apply from "./views/User/Apply/Apply.js"
import FileUpload from "./views/User/Apply/FileUpload.js";
import ForgotPassword from "./views/User/ForgotPassword.js";
import CheckValidToken from "./views/User/CheckValidToken.js";
import ResetPassword from "./views/User/ResetPassword.js";
import ListProduct from "./views/Product/ListProduct.js";
import ApplyAdvertisement from "./views/Advertisement/ApplyAdvertisement.js"
import ListAdvertisement from "./views/Advertisement/ListAdvertisement"
import AdvertisementDetails from "./views/Advertisement/AdvertisementDetails"

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
                <Route exact path="/admin/listProduct" component={ListProduct}/>
                <Route exact path="/applyAdvertisement" component={ApplyAdvertisement}/>
                <Route exact path="/admin/listAdvertisement" component={ListAdvertisement}/>
                <Route exact path="/admin/advertisementDetails" component={AdvertisementDetails}/>
                {/* <Redirect to="/error" component={Error} /> */}
            </Switch>
        </Router>
    )
}

export default App;