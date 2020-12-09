import React  from 'react';
import {  Link, useHistory } from "react-router-dom";

import notfoundimage from "notfoundimage.png";

import {
   
    Navbar
} from "reactstrap";

function ErrorPage() {
    const history = useHistory()

    return (
        <div className="text-center">
      
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
                <p className="h3" style={{marginTop:'5rem'}}>Sorry, you can't access this page!</p>      
                <img src={notfoundimage} alt="page not found" style={{width:'20rem', marginBottom:"1rem"}}></img>
                <br/>
                <Link className='h7' style={{textAlign:"center", color:"blue"}}
                    onClick={() => {
                        if (document.cookie.indexOf('merchantUser') === -1 && document.cookie.indexOf('authToken') === -1){
                            history.push('/login')
                        } else if (document.cookie.indexOf('merchantUser') > -1 && document.cookie.indexOf('authToken') > -1){
                            history.push('/admin/dashboard')
                        }
                            
                    }}>Click to return</Link>
            </div>
            
           
            
        </div>
    )

    
}

export default ErrorPage;