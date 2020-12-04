import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import {
    Row,
    Button,
    FormGroup,
    Form,
    Label,
    Input,
    Navbar,
    Alert
} from "reactstrap";

function CheckValidToken() {
    const history = useHistory()

    const email = localStorage.getItem('email')

    const [emailToken, setEmailToken] = useState('')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const onChangeToken = e => {
        const token = e.target.value;
        setEmailToken(token.trim())
        if (token.trim().length === 0) {
            setError("Please enter your token")
            isError(true)
        } else {
            isError(false)
        }
    }

const checkTokenValidity = e => {
    e.preventDefault()

    if (emailToken.trim().length === 0) {
        isError(true)
        setError("Please enter your token")
        return;
    }

    axios.post("/merchant/resetPassword/checkValidToken", {
        token: emailToken,
        email: email
    }).then (() => {
        localStorage.setItem('emailToken', emailToken)

        history.push('/resetPassword')
        isError(false)
    }).catch (function(error){
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
                    <p className="h5" style={{textAlign: 'center'}}>
                        An email has been sent to you with a token!
                    </p>
                </FormGroup>
                <FormGroup style={{...padding(0, 20, 5, 20)}}>
                    <Label for="emailToken">Enter the token received in your email</Label>
                        <Input
                        type="text"
                        name="emailToken"
                        id="emailToken"
                        placeholder="Enter Token"
                        value={emailToken}
                        onChange={onChangeToken}
                        required
                        />
                </FormGroup>
                <Row>
                    <div className="update ml-auto mr-auto" >
                        <Button color="primary" type="submit" onClick={checkTokenValidity} > 
                            Check token validity
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

export default CheckValidToken;