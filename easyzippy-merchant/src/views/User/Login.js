import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
    FormGroup,
    Label,
    Input,
    Alert,
    Button,
    Navbar,
    NavbarBrand,
    Nav,
    NavLink,
    NavItem,
    NavbarText,
    NavbarToggler,
    Collapse
} from "reactstrap";

function Login() {

    const history = useHistory()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const onChangeEmail = e => {
        // console.log("inside on change email")
        const email = e.target.value;
        setEmail(email)
        if (email.trim().length == 0) {
            setError("Email is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password)
        if (password.trim().length == 0) {
            setError("Password is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const merchant = {
        name: '',
        mobileNum: '',
        email: '',
        pointOfContact: '',
        blk: '',
        street: '',
        //fullUnitNum: '',
        floor: '',
        unitNumber: '',
        postalCode: ''
    }

    const redirect = () => {
        history.push('/apply')
    }

    const forgotPassword = () => {
        history.push('/forgotPassword')
    }

    const postLogin = e =>  {
        console.log("in login function")
        e.preventDefault()

        if (email.length === 0 || password.length === 0) {
            isError(true)
            setError("Email field is required")
            return;
        }
        
        // check if tenancy agreement for merchant has been uploaded
        axios.post(`/merchant/email`, {
            email: email,
        }).then(res => {
            //if no tenancy agreement, redirect to file upload page
            if (res.data.tenancyAgreement === null) {
                Cookies.set('merchantUser', JSON.stringify(res.data.id));
                history.push('/fileUpload')
            } else {
                axios.post('/merchant/login', {
                    email: email,
                    password: password
                })
                .then(response => {
                    console.log("axios call went through")
                    isError(false)
                    history.push('/admin/dashboard')
                    document.location.reload()
                    console.log(response.data.token)
                    Cookies.set('authToken', JSON.stringify(response.data.token));
                    Cookies.set('merchantUser', JSON.stringify(response.data.merchant.id));
        
                    merchant.name = response.data.merchant.name
                    merchant.mobileNum = response.data.merchant.mobileNumber
                    merchant.email = response.data.merchant.email
                    merchant.pointOfContact = response.data.merchant.pointOfContact
                    merchant.blk = response.data.merchant.blk
                    merchant.street = response.data.merchant.street
                    //merchant.fullUnitNum = response.data.merchant.fullUnitNum
                    merchant.floor = response.data.merchant.floor
                    merchant.unitNumber = response.data.merchant.unitNumber
                    merchant.postalCode = response.data.merchant.postalCode
        
                    console.log(merchant)
        
                    localStorage.setItem('currentMerchant', JSON.stringify(merchant))
        
                }).catch(function (error) {
                    isError(true)
                    if (error.response.data === "Merchant is not approved") {
                        setError("Account not activated")
                    } else {
                        setError(error.response.data)
                    }
                    console.log(error.response.data)
                    // check below line again,, ideally dont want to refresh, want to show error caught from backend
                    history.push('/login') 
                    //add customised alerts according to errors
                })
            }
        }).catch (function(error) {
            isError(true)
            setError(error.response.data)
            console.log(error.response.data)
        })


    };


    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <NavbarBrand>
                    &nbsp;&nbsp;
                    <img 
                        src={require("../../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span style={{fontWeight:"bold", color: 'white', width:'100%'}}>&nbsp;&nbsp;Easy Zippy</span>
                </NavbarBrand>
                <NavbarToggler onClick={toggle} style={{...padding(0, 50, 0, 0)}}>
                    <span class="navbar-toggler-icon ml-6">   
                        <i class="fas fa-bars" style={{color:"#fff", fontSize:"28px"}}></i>
                    </span>
                </NavbarToggler>
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar className="ml-auto navbar-dark sm"> 
                        <NavItem>
                            <NavLink onClick={redirect} href="/apply" >
                                Register
                            </NavLink>
                        </NavItem>
                        {/* <NavItem>
                            <NavbarText style={{color:"white"}}>
                                |
                            </NavbarText>
                        </NavItem> */}
                        <NavItem>
                            <NavLink href="/applyAdvertisement">
                                Apply for Advertisement
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
            <form style={{...padding(65, 77, 0, 77)}}>
                <FormGroup>
                    <p className="h3" style={{textAlign: 'center'}}>
                        Welcome to Ez2Keep Merchant Application
                    </p>
                </FormGroup>
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
                    <Label for="password">Password</Label>
                    <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChangePassword}
                    required
                    />
                </FormGroup>
                <Button color="primary" type="submit" onClick={postLogin} > 
                    Log In
                </Button>
                <FormGroup> 
                    <Link onClick={forgotPassword}>Forgot Password?</Link>
                </FormGroup>
                { err &&<Alert color="danger">{error}</Alert> }
            </form>
        </div>
    );
}

function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

export default Login;