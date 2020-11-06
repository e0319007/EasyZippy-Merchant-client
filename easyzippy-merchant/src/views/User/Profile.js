import React, {useState, useEffect} from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import defaultLogo from '../../assets/img/user.png';
import creditLogo from '../../assets/img/dollar-symbol.png';

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
    ModalFooter,
    UncontrolledPopover,
    PopoverBody,
    CardImg,
    Spinner,
    UncontrolledAlert
} from "reactstrap";

function Profile() {

    const ad = JSON.parse(localStorage.getItem('advertisementToView'))

    const merchant = localStorage.getItem('currentMerchant')

    const merchantid = parseInt(Cookies.get('merchantUser'))

    const authToken = JSON.parse(Cookies.get('authToken'))
    console.log(authToken)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [pointOfContact, setPointOfContact] = useState('')
    const [blk, setBlk] = useState('')
    const [street, setStreet] = useState('')
    const [floor, setFloor] = useState('')
    const [unitNumber, setUnitNumber] = useState('')
    const [postalCode, setPostalCode] = useState('')

    //in file alr not string
    const [logoToView, setLogoToView] = useState(null)
    //do like if logo to view = null then show the default photo
    // src={'../../assets/img/user.png'} i think

    const [logoToAdd, setLogoToAdd] = useState(null)
    const [logoToChange, setLogoToChange] = useState(null)

    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [newCfmPw, setNewCfmPw] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modalChange, setModalChange] = useState(false)
    const toggleChange = () => setModalChange(!modalChange);

    const [modalAdd, setModalAdd] = useState(false)
    const toggleAdd = () => setModalAdd(!modalAdd);

    //for update password modal
    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)
    const toggle = () => setModal(!modal);

    //for the credits input field
    const [pressed, setPressed] = useState(false) 
    const togglePressed = () => setPressed(!pressed)

    const [topUpAmount, setTopUpAmount] = useState('')
    const [inCredit, setInCredit] = useState(false)

    const [loading, setLoading] = useState()

    const [bookingPackage, setBookingPackage] = useState(null)

    useEffect(() => {

        axios.get(`/merchant/${merchantid}`, {
            headers: {
                AuthToken: authToken,
                'Content-Type': 'application/json'
            }
        }).then (response => {

            setName(response.data.name)
            setEmail(response.data.email)
            setMobileNumber(response.data.mobileNumber)
            setPointOfContact(response.data.pointOfContact)
            setBlk(response.data.blk)
            setStreet(response.data.street)
            setFloor(response.data.floor)
            setUnitNumber(response.data.unitNumber)
            setPostalCode(response.data.postalCode)

            axios.get(`/merchantBookingPackages/${merchantid}`, {
                headers: {
                    AuthToken: authToken
                }
            }).then (response => {
                console.log('get booking package thru')
                var bookingPackageModelId = response.data[0].bookingPackageModelId
                console.log(bookingPackageModelId)

                if (bookingPackageModelId !== null) {
                    axios.get(`/bookingPackageModel/${bookingPackageModelId}`, {
                        headers: {
                            AuthToken: authToken
                        }
                    }).then( res => {
                        console.log("get booking package model thru")
                        setBookingPackage(res.data)
                    }).catch(function (error) {
                        console.log(error)
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })

            console.log(response.data.merchantLogoImage)

            if (response.data.merchantLogoImage !== null) {
                axios.get(`/assets/${response.data.merchantLogoImage}`, {
                    responseType: 'blob'
                }, 
                {
                    headers: {
                        AuthToken: authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log('axios images thru')
                    var file = new File([response.data], {type:"image/png"})
                    let image = URL.createObjectURL(file)
                    console.log(image)
                    setLogoToView(image)
                }).catch(function (error) {
                    console.log(error)
                })
            }
            
        }).catch(function (error) {
            console.log(error)
        })

    }, [])

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

    const onChangeMobile = e => {
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

    const onChangePointOfContact = e => {
        const pointOfContact = e.target.value;
        setPointOfContact(pointOfContact.trim())
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
        const street = e.target.value;
        setStreet(street.trim())
    }

    const onChangeFloor = e => {
        const floor = e.target.value;
        if (floor.trim().length == 0) {
            setError("Floor is a required field")
            isError(true)
        } else {
            var nums = /^[0-9]+$/
            if (!floor.match(nums)) { //if not all numbers
                setError("Please enter a valid floor")
                isError(true)
            } else {
                isError(false)
            }
        }
        setFloor(floor.trim())
    }

    const onChangeUnitNumber = e => {
        const unitNumber = e.target.value;
        if (unitNumber.trim().length == 0) {
            setError("Unit number is a required field")
            isError(true)
        } else {
            var nums = /^[0-9]+$/
            if (!unitNumber.match(nums)) { //if not all numbers
                setError("Please enter a valid unit number")
                isError(true)
            } else {
                isError(false)
            }
        }
        setUnitNumber(unitNumber.trim())
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
            //fullUnitNum: fullUnitNum,
            floor: floor,
            unitNumber: unitNumber,
            postalCode: postalCode,
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
            setFloor(response.data.floor)
            setUnitNumber(response.data.unitNumber)
            setPostalCode(response.data.postalCode)
            
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

    const addLogo = e => {

        console.log("in add logo function")
        e.preventDefault()

        //need to post the image first
        let formData = new FormData();
        formData.append(logoToAdd.name, logoToAdd)
        console.log('form data values: ')
        for (var v of formData.values()) {
            console.log(v)
        }

        axios.post(`/merchantUploadLogo/${merchantid}`, formData, {

        }).then (res => {
            console.log("logo add axios call went through")
            var file = new File([res.data.merchantLogoImage], {type:"image/png"})
            let image = URL.createObjectURL(file)
            setLogoToView(image)
            window.location.reload()
        }).catch(function (error) {
            console.log(error.response.data)
        })
    }

    const changeLogo = e => {
        console.log("in change logo function")
        e.preventDefault()

        //need to post the image first
        let formData = new FormData();
        formData.append(logoToChange.name, logoToChange)
        console.log('form data values: ')
        for (var v of formData.values()) {
            console.log(v)
        }

        axios.post(`/merchantChangeLogo/${merchantid}`, formData, {
            headers: {
                AuthToken: authToken,
                'Content-Type': 'application/json'
            }
        }).then (res => {
            console.log("logo change axios call went through")
            var file = new File([res.data.merchantLogoImage], {type:"image/png"})
            let image = URL.createObjectURL(file)
            setLogoToView(image)
            window.location.reload()
        }).catch(function (error) {
            console.log(error.response.data)
        })
    }

    const deleteLogo = e => {
        e.preventDefault()
        console.log("in delete logo function")

        axios.post(`/merchantRemoveLogo/${merchantid}`, {
            headers: {
                AuthToken: authToken,
            }
        }).then(res => {
            console.log("logo successfully deleted")

        }).catch(function(error) {
            console.log(error.response.data)
        })
    }

    const onChangeLogo = e => {
        if (e.target.files[0] !== undefined) {
            setLogoToChange(e.target.files[0])
        }
    }

    const onChangeAddLogo = e => {
        if (e.target.files[0] !== undefined) {
            setLogoToAdd(e.target.files[0])
        }
    }

    const onChangeTopUpAmount = e => {
        const topUpAmount = e.target.value
        console.log(topUpAmount)
        setTopUpAmount(topUpAmount)
    }

    const topUpCredits = e => {

        if (topUpAmount === undefined || topUpAmount === "") {
            return
        }

        setLoading(true)

        axios.get(`/pay/${merchantid}/${topUpAmount}`, {
            headers: {
                AuthToken: authToken,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/xml',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',

            }
        }).then (res => {
            setLoading(false)
        }).catch(function(error) {
            setLoading(false)
            setInCredit(true)
            setError('Something went wrong, unable to top up credits')
            isError(true)
            console.log(error)
        })
        
        
    }

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "7">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5"><small>Edit Profile</small></CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div id="popover" className="text-center" style={{...padding(0,0,6,0)}}>
                                    {logoToView !== null &&
                                        <CardImg style={{width:"7rem"}} top src={logoToView} alt='...'/>
                                    }
                                    {logoToView === null &&
                                        <CardImg style={{width:"7rem"}} top src={defaultLogo} alt='...'/>
                                    }               
                                </div>
                                <UncontrolledPopover placement="right" target="popover">
                                    <PopoverBody>
                                        {logoToView === null && 
                                            <Button color="primary" onClick={toggleAdd}>
                                                <i className="fas fa-plus"/>
                                            </Button>
                                        }
                                        {logoToView !== null &&
                                        <>
                                            <Button onClick={toggleChange}>
                                                <i className="fas fa-edit"/>
                                            </Button>
                                            <Button color="danger" onClick={deleteLogo}>
                                                <i className="fa fa-trash-alt"/>
                                            </Button> 
                                        </>     
                                        }
                                    </PopoverBody>
                                </UncontrolledPopover>
                                <p>{' '}</p>
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
                                                required
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
                                                required
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
                                                required
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
                                                required
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
                                                required
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
                                                required
                                                />
                                        </FormGroup>
                                    </div>
                                    <div className="form-row">
                                        <FormGroup className="col-md-4">
                                            <Label for="inputFloor">Floor</Label>
                                            <Input 
                                                type="text" 
                                                id="inputFloor" 
                                                placeholder="Enter floor Number (e.g. 03)" 
                                                value={floor}
                                                onChange={onChangeFloor}
                                                required
                                                />
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                                            <Label for="inputUnitNum">Unit Number</Label>
                                            <Input 
                                                type="text" 
                                                id="inputUnitNum" 
                                                placeholder="Enter unit number (e.g. 230)" 
                                                value={unitNumber}
                                                onChange={onChangeUnitNumber}
                                                required
                                                />
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                                            <Label for="inputPostalCode">Postal Code</Label>
                                            <Input 
                                                type="text" 
                                                id="inputPostalCode" 
                                                placeholder="Enter Postal Code (e.g. 768590)" 
                                                value={postalCode}
                                                onChange={onChangePostalCode}
                                                required
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
                                    { !inModal && !inCredit && err &&<Alert color="danger">{error}</Alert> }
                                    { !inModal && !inCredit && successful &&<Alert color="success">{successMsg}</Alert> }
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
                                        { inModal && !inCredit && err &&<Alert color="danger">{error}</Alert> }
                                        { inModal && !inCredit && successful &&<Alert color="success">{successMsg}</Alert>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                <Button color="primary" onClick={updatePassword}>Update</Button>{' '}
                                <Button color="secondary" onClick={reset}>Reset</Button>
                                </ModalFooter>
                            </Modal>
                            <Modal isOpen={modalChange} toggle={toggleChange}>
                                <ModalHeader toggle={toggleChange}>Change Logo</ModalHeader>
                                <ModalBody>
                                    <form>
                                        <FormGroup>
                                            <Label>Choose New Logo</Label>
                                                <div className='custom-file mb-4'>
                                                    <Input
                                                        type='file'
                                                        className='custom-file-input'
                                                        id='customFile'
                                                        onChange={onChangeLogo}
                                                    />
                                                </div>
                                        </FormGroup>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={changeLogo}>Upload</Button>{' '}
                                </ModalFooter>
                            </Modal>
                            <Modal isOpen={modalAdd} toggle={toggleAdd}>
                                <ModalHeader toggle={toggleAdd}>Upload New Logo</ModalHeader>
                                <ModalBody>
                                    <form>
                                        <FormGroup>
                                            <Label>Choose Logo</Label>
                                                <div className='custom-file mb-4'>
                                                    <Input
                                                        type='file'
                                                        className='custom-file-input'
                                                        id='customFile'
                                                        onChange={onChangeAddLogo}
                                                    />
                                                </div>
                                        </FormGroup>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={addLogo}>Upload</Button>{' '}
                                </ModalFooter>
                            </Modal>
                        </Card>
                    </Col>
                    <Col md="5">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5"><small>Credit</small></CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody className='text-center'>
                                <p>{' '}</p>
                                <div>
                                    <CardImg src={creditLogo} style={{width:"5rem"}} top alt='...'/>
                                </div>
                                <p>&nbsp;</p>
                                <Button onClick={togglePressed}>
                                    Top-up Credits
                                </Button>
                                {!pressed && 
                                <p>&nbsp;</p>
                                }
                                {pressed && 
                                <form>
                                    <FormGroup className='w-50 ml-auto mr-auto'>
                                        <Label for="inputTopUpAmount"></Label>
                                            <Input 
                                                type="text" 
                                                id="inputTopUpAmount" 
                                                placeholder="Enter Amount to Top Up" 
                                                value={topUpAmount}
                                                onChange={onChangeTopUpAmount}
                                                />
                                    </FormGroup>
                                    <Button color="primary" onClick={topUpCredits}>
                                        <i className="fas fa-arrow-right"/>
                                    </Button>{' '}
                                    {loading &&
                                    <Spinner size="sm" color="primary" />
                                    }
                                    { inCredit && !inModal && err &&<UncontrolledAlert color="danger">{error}</UncontrolledAlert> }
                                </form>
                                }
                            </CardBody>
                        </Card>
                        <Card className="card-name">
                            {bookingPackage !== null &&
                                <CardHeader>
                                    <div className="form-row">
                                        <CardTitle className="col-md-10" tag="h5"><small>Current Booking Package</small></CardTitle>
                                    </div>
                                    <p>&nbsp;</p>
                                    {/* //duration name locker type */}
                                    <CardBody className='text-center'>
                                        <p>{' '}</p>
                                    </CardBody>
                                </CardHeader>
                            }
                            {bookingPackage === null && 
                                <CardHeader>
                                    <div className="form-row">
                                        <CardTitle className="col-md-10" tag="h5"><small>Booking Package</small></CardTitle>
                                        <CardBody className='text-center'>
                                            <p>&nbsp;</p>
                                            <Button>Buy Package</Button>
                                        </CardBody>
                                    </div>
                                </CardHeader>
                            }
                        </Card>
                    </Col>
                </Row>
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


export default Profile;