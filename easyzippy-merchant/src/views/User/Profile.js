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
    const [pointOfContact, setPointOfContact] = useState(merchant.pointOfContact)
    const [blk, setBlk] = useState(merchant.setBlk)
    const [street, setStreet] = useState(merchant.street)
    const [fullUnitNum, setFullUnitNum] = useState(merchant.fullUnitNum)
    const [postalCode, setPostalCode] = useState(merchant.postalCode)

    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [newCfmPw, setNewCfmPw] = useState('')

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
        email: '',
        pointOfContact: '',
        blk: '',
        street: '',
        fullUnitNum: '', 
        postalCode: ''
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

    const onChangePointOfContact = e => {
        const pointOfContact = e.target.value;
        setPointOfContact(pointOfContact.trim())
    }

    const onChangeBlk = e => {
        const blk = e.target.value;
        setBlk(blk.trim())
    }

    const onChangeStreet = e => {
        const street = e.target.value;
        setStreet(street.trim())
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

    const updateProfile = e => {
        e.preventDefault()
        console.log("in update profile")

        axios.put(`/merchant/${merchantid}`, {
            name: name,
            email: email,
            mobileNumber: mobileNumber,
            pointOfContact: pointOfContact,
            blk: blk,
            street: street,
            fullUnitNum: fullUnitNum,
            postalCode: postalCode
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
            setPointOfContact(response.data.pointOfContact)
            setBlk(response.data.blk)
            setStreet(response.data.street)
            setFullUnitNum(response.data.setFullUnitNum)
            setPostalCode(response.data.postalCode)
            
            // save new values to staff local storage
            merchant_toupdate.name = response.data.name
            merchant_toupdate.mobileNum = response.data.mobileNumber
            merchant_toupdate.email = response.data.email
            merchant_toupdate.pointOfContact = response.data.pointOfContact
            merchant_toupdate.blk = response.data.blk
            merchant_toupdate.street = response.data.street
            merchant_toupdate.fullUnitNum = response.data.fullUnitNum
            merchant_toupdate.postalCode = response.data.postalCode
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

        var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
        if (reg.test(newPw)) { //if valid
            isError(false)
            isSuccessful(false)
        } else {
            isInModal(true)
            setError("Password is not strong enough (Have at least 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character)")
            isError(true)
            isSuccessful(false)
        }

        setNewPw(newPw.trim())
    }

    const onChangeNewCfmPassword = e => {
        const newCfmPw = e.target.value;
        setNewCfmPw(newCfmPw.trim())
    }

    const updatePassword = e => {
        e.preventDefault()
        console.log("inside update password")

        if (newPw !== newCfmPw) {
            isInModal(true)
            setError("New passwords need to match!")
            isError(true)
            return;
        }

        if (newPw === currentPw) {
            isInModal(true)
            setError("Your old and new passwords are the same")
            isError(true)
            return;
        }

        axios.put(`/merchant/${merchantid}/changePassword`, {
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
            setCurrentPw('')
            setNewCfmPw('')
            setNewPw('')
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
        setNewCfmPw('')
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
                                    <div className="form-row">
                                        <FormGroup className="col-md-6">
                                            <Label for="inputName">Name</Label>
                                            <Input 
                                                type="text" 
                                                id="inputName" 
                                                placeholder="Name"
                                                value={name}
                                                onChange={onChangeName}
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-6">
                                            <Label for="inputPointOfContact">Point Of Contact</Label>
                                            <Input 
                                                type="text" 
                                                id="inputPointOfContact" 
                                                placeholder="Point of Contact"
                                                value={pointOfContact}
                                                onChange={onChangePointOfContact}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-row">
                                        <FormGroup className="col-md-6">
                                            <Label for="inputEmail">Email</Label>
                                            <Input 
                                                type="email" 
                                                id="inputEmail" 
                                                placeholder="Email" 
                                                value={email}
                                                onChange={onChangeEmail}
                                                />
                                        </FormGroup>
                                        <FormGroup className="col-md-6">
                                            <Label for="inputMobile">Mobile Number</Label>
                                            <Input 
                                                type="text" 
                                                id="inputMobile" 
                                                placeholder="Mobile Number" 
                                                value={mobileNumber}
                                                onChange={onChangeMobile}
                                                />
                                        </FormGroup>
                                    </div>
                                    <div className="form-row">
                                        <FormGroup className="col-md-6">
                                            <Label for="inputBlock">Block</Label>
                                            <Input 
                                                type="text" 
                                                id="inputBlock" 
                                                placeholder="Block" 
                                                value={blk}
                                                onChange={onChangeBlk}
                                                />
                                        </FormGroup>
                                        <FormGroup className="col-md-6">
                                            <Label for="inputStreet">Street</Label>
                                            <Input 
                                                type="text" 
                                                id="inputStreet" 
                                                placeholder="Street" 
                                                value={street}
                                                onChange={onChangeStreet}
                                                />
                                        </FormGroup>
                                    </div>
                                    <div className="form-row">
                                        <FormGroup className="col-md-6">
                                            <Label for="inputUnitNum"><small>Unit Number</small></Label>
                                            <Input
                                                type="name"
                                                id="inputUnitNum"
                                                placeholder="Enter Unit Number (e.g. 03-05)"
                                                value={fullUnitNum}
                                                onChange={onChangeFullUnitNum}
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-6">
                                            <Label for="inputPostalCode"><small>Postal Code</small></Label>
                                            <Input
                                                type="name"
                                                id="inputPostalCode"
                                                placeholder="Enter Postal Code (e.g. 768590)"
                                                value={postalCode}
                                                onChange={onChangePostalCode}
                                            />
                                        </FormGroup>
                                    </div>
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
                                        <FormGroup>
                                            <Label for="inputNewConfirmPassword">Re-enter new password</Label>
                                            <Input 
                                                type="password" 
                                                id="inputNewConfirmPassword" 
                                                placeholder="Re-enter new password" 
                                                value={newCfmPw}
                                                onChange={onChangeNewCfmPassword}
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