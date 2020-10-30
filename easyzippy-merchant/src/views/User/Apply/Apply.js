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

function Apply() {

    const history = useHistory()

    const [name, setName] = useState('')
    const [poc, setPoc] = useState('')
    const [blk, setBlk] = useState('')
    const [street, setStreet] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [fullUnitNum, setFullUnitNum] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const onChangeName = e => {
        const name = e.target.value;
        setName(name)
        if (name.trim().length == 0) {
            setError("Name is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangePoc = e => {
        const poc = e.target.value
        setPoc(poc)
    }

    const onChangeBlk = e => {
        const blk = e.target.value

        var nums = /^[0-9]+$/
            if (!blk.match(nums) && blk.length > 0) { //if not all numbers
                setError("Please enter a valid block number")
                isError(true)
            } else {
                isError(false)
            }

        setBlk(blk.trim())
    }

    const onChangeStreet = e => {
        const street = e.target.value
        setStreet(street)
    }

    const onChangePostalCode = e => {
        const postal = e.target.value
        
        if (postal.trim().length !== 6) {
            setError("Postal code has to be exactly 6 numbers")
            isError(true)
        } else {
            var nums = /^[0-9]+$/
            if (!postal.match(nums)) { //if not all numbers
                setError("Please enter a valid postal code")
                isError(true)
            } else {
                isError(false)
            }
        }
        setPostalCode(postal.trim())
    }

    const onChangeFullUnitNum = e => {
        const unitNum = e.target.value

        if ((unitNum.indexOf('-') <= 0 || unitNum.charAt(0) === '-') && unitNum.length > 0) {

            setError("Please enter a valid Unit Number")
            isError(true)
        } else {
            isError(false)
        }

        setFullUnitNum(unitNum.trim())
    }

    const onChangeMobileNumber = e => {
        const mobileNumber = e.target.value;
        
        if (mobileNumber.trim().length == 0) {
            setError("Mobile Number is a required field")
            isError(true)
        } else {
            var nums = /^[0-9]+$/
            if (!mobileNumber.match(nums)) { //if not all numbers
                setError("Please enter a valid mobile number")
                isError(true)
            } else {
                isError(false)
            }
        }
        setMobileNumber(mobileNumber.trim())
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

        var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
        if (reg.test(password)) { //if valid
            isError(false)
        } else {
            setError("Password is not strong enough (Have at least 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character)")
            isError(true)
        }
    }

    const onChangePassword2 = e => {
        const password2 = e.target.value;
        setPassword2(password2.trim())
        if (password2.trim().length == 0) {
            setError("Please re-enter password")
            isError(true)
        } else if (password2.trim() !== password.trim()) {
            setError("Passwords are not the same")
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

        let arr = fullUnitNum.split('-')

        console.log("arr0: " + arr[0])
        console.log("arr1: " + arr[1])

        const fl = arr[0]
        const un = arr[1]

        // register merchant
        axios.post("/merchant", {
            name: name,
            pointOfContact: poc,
            mobileNumber: mobileNumber,
            email: email,
            blk: blk,
            street: street,
            floor: fl,
            unitNumber: un,
            postalCode: postalCode,
            password: password
        }).then( response => {
            console.log("axios call went through")
            Cookies.set('merchantUser', JSON.stringify(response.data.id));
            isError(false)
            history.push('/fileUpload')
        }).catch(function(error) {
            console.log(error.response.data)
            isError(true)
            setError(error.response.data)
        })
    }

    const redirect = () => {
        history.push("/login")
    }

    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <div className="navbar-brand">
                    &nbsp;&nbsp;
                    <img 
                        src={require("../../../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span onClick={redirect} style={{fontWeight:"bold", color: 'white', width:'100%', cursor:"pointer"}}>&nbsp;&nbsp;Easy Zippy</span>
                </div>
            </Navbar>
            <form style={{...padding(5, 37, 0, 37)}}>
                <FormGroup>
                    <p className="h6" style={{textAlign: 'center'}}>
                        Join Ez2Keep as a Merchant!
                    </p>
                </FormGroup>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="name"><small>Merchant</small></Label>
                            <Input
                            type="name"
                            name="name"
                            id="name"
                            placeholder="Enter Merchant"
                            value={name}
                            onChange={onChangeName}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="poc"><small>Point of Contact</small></Label>
                            <Input
                            type="name"
                            name="poc"
                            id="poc"
                            placeholder="Enter Name of Point of Contact"
                            value={poc}
                            onChange={onChangePoc}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="mobileNumber"><small>Mobile Number</small></Label>
                            <Input
                            type="mobileNumber"
                            name="mobileNumber"
                            id="mobileNumber"
                            placeholder="Enter Mobile Number"
                            value={mobileNumber}
                            onChange={onChangeMobileNumber}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="blk"><small>Block</small></Label>
                            <Input
                            type="name"
                            name="blk"
                            id="blk"
                            placeholder="Enter Block"
                            value={blk}
                            onChange={onChangeBlk}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="street"><small>Street</small></Label>
                            <Input
                            type="name"
                            name="street"
                            id="street"
                            placeholder="Enter Street"
                            value={street}
                            onChange={onChangeStreet}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="unitNum"><small>Unit Number</small></Label>
                            <Input
                            type="name"
                            name="unitNum"
                            id="unitNum"
                            placeholder="Enter Unit Number (e.g. 03-05)"
                            value={fullUnitNum}
                            onChange={onChangeFullUnitNum}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="postalCode"><small>Postal Code</small></Label>
                            <Input
                            type="name"
                            name="postalCode"
                            id="postalCode"
                            placeholder="Enter Postal Code (e.g. 768590)"
                            value={postalCode}
                            onChange={onChangePostalCode}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="email"><small>Email address</small></Label>
                    <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={onChangeEmail}
                    required
                    style={{...padding(5, 5, 5, 5)}}
                    />
                </FormGroup>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="password"><small>Enter password</small></Label>
                            <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={onChangePassword}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="password2"><small>Re-enter password</small></Label>
                            <Input
                            type="password"
                            name="password2"
                            id="password2"
                            placeholder="Re-enter password"
                            value={password2}
                            onChange={onChangePassword2}
                            required
                            style={{...padding(5, 5, 5, 5)}}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                <div className="update ml-auto mr-auto" >
                    <Button color="primary" type="submit" onClick={postApply}  style={{...padding(10, 15, 10, 15)}}> 
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