import React, {useState} from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    FormGroup,
    Label,
    Input,
    Button,
    Alert,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter
} from "reactstrap";

const API_SERVER = "http://localhost:5000/merchant"

function Profile() {

    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))
    console.log("test " + merchant.name)

    const merchantid = parseInt(Cookies.get('merchantUser'))
    console.log(typeof merchantid)

    const authToken = JSON.parse(Cookies.get('authToken'))
    console.log(typeof authToken + " " + authToken)

    const [name, setName] = useState(merchant.name)
    const [email, setEmail] = useState(merchant.email)
    const [mobileNumber, setMobileNumber] = useState(merchant.mobileNum)

    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal);

    const merchant_toupdate = {
        name: '',
        mobileNum: '',
        email: ''
    }

    const onChangeName = e => {
        const name = e.target.value;
        setName(name.trim())
    }

    const onChangeEmail = e => {
        const email = e.target.value;
        setEmail(email.trim())
    }

    const onChangeMobile = e => {
        const mobile = e.target.value;
        setMobileNumber(mobile.trim())
    }

    const updateProfile = e => {
        e.preventDefault()
        console.log("in update profile")

        axios.put(`http://localhost:5000/merchant/${merchantid}`, {
            name: name,
            email: email,
            mobileNumber: mobileNumber
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then((response) => {
            console.log("axios call went through")
            // set response data to view
            setName(response.data.name)
            setEmail(response.data.email)
            setMobileNumber(response.data.mobileNumber)
            
            // save new values to staff local storage
            merchant_toupdate.firstName = response.data.name
            merchant_toupdate.mobileNum = response.data.mobileNumber
            merchant_toupdate.email = response.data.email
            localStorage['currentMerchant'] = JSON.stringify(merchant_toupdate)
            
            isInModal(false)
            isError(false)
            isSuccessful(true)
            setMsg("profile updated successfully!")
        }).catch(function (error) {
            isInModal(false)
            isError(true)
            isSuccessful(false)
            setError(error.response.data)
        })
    }

    const onChangeCurrPassword = e => {
        const currentPw = e.target.value;
        setCurrentPw(currentPw.trim())
    }

    const onChangeNewPassword = e => {
        const newPw = e.target.value;
        setNewPw(newPw.trim())
    }


    const updatePassword = e => {
        e.preventDefault()
        console.log("inside update password")

        axios.put(`http://localhost:5000/merchant/${merchantid}/changePassword`, {
            currentPassword: currentPw,
            newPassword: newPw
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then((response) => {
            console.log("axios call went through")
            isInModal(true)
            isError(false)
            isSuccessful(true)
            setMsg("Password successfully updated!")
        }).catch(function (error) {
            console.log(error.response.data)
            isInModal(true)
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }

    const reset = e => {
        e.preventDefault()
        console.log("inside reset form")
        setCurrentPw('')
        setNewPw('')
    }

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5">Edit Profile</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <FormGroup>
                                        <Label for="inputName">Name</Label>
                                        <Input 
                                            type="text" 
                                            id="inputName" 
                                            placeholder="Name"
                                            value={name}
                                            onChange={onChangeName}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="inputEmail">Email</Label>
                                        <Input 
                                            type="email" 
                                            id="inputEmail" 
                                            placeholder="Email" 
                                            value={email}
                                            onChange={onChangeEmail}
                                            />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="inputMobile">Mobile Number</Label>
                                        <Input 
                                            type="text" 
                                            id="inputMobile" 
                                            placeholder="Mobile Number" 
                                            value={mobileNumber}
                                            onChange={onChangeMobile}
                                            />
                                    </FormGroup>
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Button color="success" size="sm" type="submit" onClick={updateProfile}>Update Profile</Button>
                                            {' '}
                                            <Button color="primary" size="sm" onClick={toggle}>Change Password</Button>
                                        </div>
                                    </Row>
                                    { !inModal && err &&<Alert color="danger">{error}</Alert> }
                                    { !inModal && successful &&<Alert color="success">{successMsg}</Alert> }
                                </form>
                            </CardBody>
                            <Modal isOpen={modal} toggle={toggle}>
                                <ModalHeader toggle={toggle}>Change Password</ModalHeader>
                                <ModalBody>
                                    <form>
                                        <FormGroup>
                                            <Label for="inputPassword">Current password</Label>
                                            <Input 
                                                type="password" 
                                                id="inputPassword" 
                                                placeholder="Enter current password" 
                                                value={currentPw}
                                                onChange={onChangeCurrPassword}
                                                />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="inputNewPassword">New password</Label>
                                            <Input 
                                                type="password" 
                                                id="inputNewPassword" 
                                                placeholder="Enter new password" 
                                                value={newPw}
                                                onChange={onChangeNewPassword}
                                                />
                                        </FormGroup>
                                        { inModal && err &&<Alert color="danger">{error}</Alert> }
                                        { inModal && successful &&<Alert color="success">{successMsg}</Alert>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                <Button color="primary" onClick={updatePassword}>Update</Button>{' '}
                                <Button color="secondary" onClick={reset}>Reset</Button>
                                </ModalFooter>
                            </Modal>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Profile;