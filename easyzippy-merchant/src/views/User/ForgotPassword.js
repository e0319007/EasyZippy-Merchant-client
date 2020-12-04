import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import {
    FormGroup,
    Form,
    Label,
    Input,
    Navbar,
    Alert,
    Button,
    Row
} from "reactstrap";


function ForgotPassword() {

    const history = useHistory()

    const [email, setEmail] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const onChangeEmail = e => {
        const email = e.target.value;
        setEmail(email.trim())
        if (email.trim().length === 0) {
            setError("Please key in your email")
            isError(true)
        } else {
            isError(false)
        }
    }

    const sendEmail = e => {
        e.preventDefault()

        if (email.trim().length === 0) {
            isError(true)
            setError("Please key in your email")
            return;
        }

        axios.post("/merchant/forgotPassword", {
            email: email
        }).then(() => {
            
            localStorage.setItem('email', email)
            
            history.push('/checkValidToken')
            isError(false)
        }).catch(function(error) {
            isError(true)
            setError(error.response.data)
        })
    }

    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <div className="navbar-brand">
                    &nbsp;&nbsp;
                    <img 
                        src={require("../../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span style={{fontWeight:"bold", color: 'white', width:'100%'}}>&nbsp;&nbsp;Easy Zippy</span>
                </div>
            </Navbar>
            <Form style={{...padding(40, 57, 0, 57)}}>
                <FormGroup style={{...padding(0, 0, 5, 0)}}>
                    <p className="h4" style={{textAlign: 'center'}}>
                        Reset your password
                    </p>
                </FormGroup>
                <FormGroup style={{...padding(0, 20, 5, 20)}}>
                    <Label for="email">Enter your email</Label>
                        <Input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={onChangeEmail}
                        required
                        />
                </FormGroup>
                <Row>
                    <div className="update ml-auto mr-auto" >
                        <Button color="primary" type="submit" onClick={sendEmail} > 
                            Click to send email
                        </Button>
                    </div>
                </Row>
                { err &&<Alert color="danger">{error}</Alert> }
            </Form>
        </div>
    )
}

function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

export default ForgotPassword;