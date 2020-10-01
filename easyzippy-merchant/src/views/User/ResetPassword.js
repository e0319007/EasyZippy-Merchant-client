import React, {useState} from "react";
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

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

function ResetPassword() {

    const history = useHistory()

    const email = localStorage.getItem('email')
    const emailToken = localStorage.getItem('emailToken')

    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const onChangePassword = e => {
        const password = e.target.value;

        var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
        if (reg.test(password)) { //if valid
            isError(false)
        } else {
            setError("Password is not strong enough (Have at least 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character)")
            isError(true)
        }

        setPassword(password.trim())
    }

    const onChangePassword2 = e => {
        const password2 = e.target.value;
        setPassword2(password2.trim())
    }

    const resetPassword = e => {
        console.log("inside update password")
        e.preventDefault()

        if (password !== password2) {
            setError("Passwords do not match")
            isError(true)
            isSuccessful(false)
            return;
        }

        axios.post("/merchant/resetPassword", {
            token: emailToken,
            email: email,
            newPassword: password,
        }).then((response) => {
            console.log("axios call went through")
            isError(false)
            isSuccessful(true)
            setMsg("Password successfully reset!")

            localStorage.removeItem('emailToken')
            localStorage.removeItem('email')
            history.push('/login')
        }).catch(function (error) {
            console.log(error.response.data)
            isError(true)
            setError(error.response.data)
        })
    }

    const redirect = () => {
        history.push('/login')
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
                        One last step to reset your password:
                    </p>
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
                        <Button color="primary" type="submit" onClick={resetPassword} > 
                            Reset Password
                        </Button>
                    </div>
                </Row>
                {/* <FormGroup> 
                    <Link onClick={redirect}>● Return to login page to sign in.</Link>
                </FormGroup> */}
                { err &&<Alert color="danger">{error}</Alert> }
                { successful &&<Alert color="success">{successMsg}</Alert>}
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

export default ResetPassword;