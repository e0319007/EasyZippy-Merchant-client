import React from 'react';
import { BrowserRouter as Router, useHistory } from "react-router-dom";


import {
    Navbar
} from "reactstrap";

function Error() {

    const history = useHistory()


    return (
        <Router>
            <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
                <Navbar expand="lg" color="dark">
                    <div className="navbar-brand">
                        &nbsp;&nbsp;
                        <img 
                            src={require("../easyzippylogo.jpg")}
                            width="30"
                            height="30"
                        />
                        {' '}
                        <span style={{fontWeight:"bold", color: 'white', width:'100%'}}>&nbsp;&nbsp;Easy Zippy</span>
                    </div>
                </Navbar>
                <div>
                    <p className='h4' style={{textAlign:"center", paddingTop:"80"}}>Error Page</p>
                    <p className='h7' style={{textAlign:"center", color:"blue"}}
                        onClick={() => {
                            if (document.cookie.indexOf('merchantUser') === -1 && document.cookie.indexOf('authToken') === -1){
                                history.push('/login')
                            } else if (document.cookie.indexOf('merchantUser') > -1 && document.cookie.indexOf('authToken') > -1){
                                history.push('/admin/dashboard')
                            }
                            
                        }}>Click to return</p>
                </div>
            </div>
        </Router>
    );
}

export default Error;