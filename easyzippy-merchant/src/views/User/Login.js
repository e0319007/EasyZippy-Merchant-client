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
    NavbarToggler,
    Collapse,
    Card,
    Row,
    Col,
    CardHeader,
    CardBody,
    CardTitle
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
        const email = e.target.value;
        setEmail(email)
    }

    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password)
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
        postalCode: '',
        merchantLogoImage: null,
        creditBalance: ''
    }

    const redirect = () => {
        history.push('/apply')
    }

    const forgotPassword = () => {
        history.push('/forgotPassword')
    }

    const postLogin = e =>  {
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
                    isError(false)
                    Cookies.set('authToken', JSON.stringify(response.data.token));
                    Cookies.set('merchantUser', JSON.stringify(response.data.merchant.id));
        
                    merchant.name = response.data.merchant.name
                    merchant.mobileNum = response.data.merchant.mobileNumber
                    merchant.email = response.data.merchant.email
                    merchant.pointOfContact = response.data.merchant.pointOfContact
                    merchant.blk = response.data.merchant.blk
                    merchant.street = response.data.merchant.street
                    merchant.floor = response.data.merchant.floor
                    merchant.unitNumber = response.data.merchant.unitNumber
                    merchant.postalCode = response.data.merchant.postalCode
                    merchant.creditBalance = response.data.merchant.creditBalance

                    if (response.data.merchant.merchantLogoImage !== null) {
                        axios.get(`/assets/${response.data.merchant.merchantLogoImage}`, {
                            responseType: 'blob'
                        }).then(res => {
                            var file = new File([response.data], {type:"image/png"})
                            let image = URL.createObjectURL(file)
                            merchant.merchantLogoImage = image
    
            
                            localStorage.setItem('currentMerchant', JSON.stringify(merchant))
                            
                            history.push('/admin/dashboard')
                            document.location.reload()
                        }).catch(function (error) {
                        })
                    } else {
                        localStorage.setItem('currentMerchant', JSON.stringify(merchant))
                            
                        history.push('/admin/dashboard')
                        document.location.reload()
                    }
                }).catch(function (error) {
                    isError(true)
                    if (error.response.data === "Merchant is not approved") {
                        setError("Account not activated")
                    } else {
                        setError(error.response.data)
                    }
                    // check below line again,, ideally dont want to refresh, want to show error caught from backend
                    history.push('/login') 
                    //add customised alerts according to errors
                })
            }
        }).catch (function(error) {
            isError(true)
            setError(error.response.data)
        })


    };
 

    return (
        <>
        
        <div style={{
             height: '100vh', 
            width:'100%', 
            backgroundImage:`url(${require("../../background2.png")})`, 
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            }}>
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
                    <span className="navbar-toggler-icon ml-6">   
                        <i className="fas fa-bars" style={{color:"#fff", fontSize:"28px"}}></i>
                    </span>
                </NavbarToggler>
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar className="ml-auto navbar-dark sm"> 
                        <NavItem>
                            <NavLink onClick={redirect} href="/apply" >
                                Register
                            </NavLink>
                        </NavItem>
                  
                        <NavItem>
                            <NavLink href="/applyAdvertisement">
                                Apply for Advertisement
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
            <div style={{marginTop:"5rem", overflow:'hidden'}}>
        
                    <Row 
                    style={{
                         display: "flex",
                          justifyContent: "center",
                          alignItems: "center", 
                          }}
                          >
                        <Col md="5">
                            <Card>
                                    <CardHeader className="h3" style={{textAlign: 'center'}}>
                                        <div className="form-row">
                                        <CardTitle className="col-md-12" tag="h5"><small>Welcome to Ez2Keep Merchant Portal</small></CardTitle>
                                        </div>
                                    </CardHeader>
                            
                                <CardBody>
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
                                <FormGroup style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center"
                                      }}>
                                    <Button color="primary" type="submit" onClick={postLogin} style={{width: "60rem"}}> 
                                        Log In
                                    </Button>

                                </FormGroup>
                                <FormGroup style={{display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center"}}> 
                                    <Link onClick={forgotPassword}>Forgot Password?</Link>
                                </FormGroup>
                                { err &&<Alert color="danger">{error}</Alert> }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
       

            </div>
        </div>
        </>
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