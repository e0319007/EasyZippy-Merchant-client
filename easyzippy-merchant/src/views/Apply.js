import axios from 'axios';
import React, {useState} from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

import {
    FormGroup,
    Label,
    Input,
    Alert,
    Button,
    Navbar,
    Row,
    Col,
} from "reactstrap";

const API_SERVER = "http://localhost:5000/merchant"

function Apply() {

    const history = useHistory()

    const [name, setName] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const onChangeName = e => {
        const name = e.target.value;
        setName(name.trim())
        if (name.trim().length == 0) {
            setError("Name is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangeMobileNumber = e => {
        const mobileNumber = e.target.value;
        setMobileNumber(mobileNumber.trim())
        if (mobileNumber.trim().length == 0) {
            setError("Mobile Number is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangeEmail = e => {
        const email = e.target.value;
        setEmail(email.trim())
        if (email.trim().length == 0) {
            setError("Email is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password.trim())
        if (password.trim().length == 0) {
            setError("Password is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangePassword2 = e => {
        const password2 = e.target.value;
        setPassword2(password2.trim())
        if (password2.trim().length == 0) {
            setError("Please re-enter password")
            isError(true)
        } else {
            isError(false)
        }
    }

    // apply without the tenancy agreement
    const postApply = e => {
        console.log("in post apply function")
        e.preventDefault()

        if (password.trim() != password2.trim()) {
            isError(true)
            setError("Passwords do not match")
            return;
        }

        // register merchant
        axios.post(API_SERVER, {
            name: name,
            mobileNumber: mobileNumber,
            email: email,
            password: password
        }).then( response => {
            console.log("axios call went through")
            Cookies.set('merchantUser', JSON.stringify(response.data.id));
            isError(false)
            history.push('/fileUpload')
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
                        src={require("../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span style={{fontWeight:"bold", color: 'white', width:'100%'}}>&nbsp;&nbsp;Easy Zippy</span>
                </div>
            </Navbar>
            <form style={{...padding(20, 57, 0, 57)}}>
                <FormGroup>
                    <p className="h6" style={{textAlign: 'center'}}>
                        Join Ez2Keep as a Merchant!
                    </p>
                </FormGroup>
                <Row>
                    <p></p>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                            type="name"
                            name="name"
                            id="name"
                            placeholder="Enter Name"
                            value={name}
                            onChange={onChangeName}
                            required
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="mobileNumber">Mobile Number</Label>
                            <Input
                            type="mobileNumber"
                            name="mobileNumber"
                            id="mobileNumber"
                            placeholder="Enter Mobile Number"
                            value={mobileNumber}
                            onChange={onChangeMobileNumber}
                            required
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="email">Email address</Label>
                    <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={onChangeEmail}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Enter new password</Label>
                    <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={onChangePassword}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password2">Re-enter password</Label>
                    <Input
                    type="password"
                    name="password2"
                    id="password2"
                    placeholder="Re-enter password"
                    value={password2}
                    onChange={onChangePassword2}
                    required
                    />
                </FormGroup>
                <Row>
                <div className="update ml-auto mr-auto" >
                    <Button color="primary" type="submit" onClick={postApply} > 
                        Apply
                    </Button>
                </div>
                </Row>
                { err &&<Alert color="danger">{error}</Alert> }
            </form >
            
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

export default Apply;