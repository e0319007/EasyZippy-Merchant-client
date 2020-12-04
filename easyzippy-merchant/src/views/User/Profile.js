import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import defaultLogo from '../../assets/img/user.png';
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";
import TransactionHistory from '../User/TransactionHistory';

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
    UncontrolledAlert
} from "reactstrap";

function Profile() {

    const history = useHistory()

    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))

    const merchantid = parseInt(Cookies.get('merchantUser'))

    const authToken = JSON.parse(Cookies.get('authToken'))

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [pointOfContact, setPointOfContact] = useState('')
    const [blk, setBlk] = useState('')
    const [street, setStreet] = useState('')
    const [floor, setFloor] = useState('')
    const [unitNumber, setUnitNumber] = useState('')
    const [postalCode, setPostalCode] = useState('')

    
    const [logoToView, setLogoToView] = useState(null)
    

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

    //for view current booking package details modal
    const [bookingPackageDetailsModal, setBookingPackageDetailsModal] = useState(false)
    const toggleBookingPackageDetails = () => setBookingPackageDetailsModal(!bookingPackageDetailsModal)

    //for the buy package to choose kiosk
    const [pressed, setPressed] = useState(false) 
    const togglePressed = () => setPressed(!pressed)
    const [kiosksToBuy, setKiosksToBuy] = useState([])
    const [buyPackageKioskId, setBuyPackageKioskId] = useState('')
    const [buyPackageKiosk, setBuyPackageKiosk] = useState('')

    const [topUpAmount, setTopUpAmount] = useState('')
    const [inCredit, setInCredit] = useState(false)

    const [withdrawModal, setWithdrawModal] = useState(false)
    const toggleWithdraw = () => setWithdrawModal(!withdrawModal)
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [inWithdraw, setInWithdraw] = useState(false)
    const [paypalEmail, setPaypalEmail] = useState('')
    const [creditBalance, setCreditBalance] = useState(0)

    const [transactionModal, setTransactionModal] = useState(false)
    const toggleTransaction = () => setTransactionModal(!transactionModal)

    const [bookingPackage, setBookingPackage] = useState('')
    const [bookingPackageModel, setBookingPackageModel] = useState('')
    const [kioskAddress, setKioskAddress] = useState('')

    //to stop people from clicking the withdraw button twice
    const [withdrawDisabled, setWithdrawDisabled] = useState(false)

    useEffect(() => {

        setWithdrawDisabled(false)

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
            setCreditBalance(response.data.creditBalance)
            merchant.creditBalance = (parseFloat(response.data.creditBalance).toFixed(2))
            localStorage.setItem('currentMerchant', JSON.stringify(merchant))
            

            axios.get(`/merchantBookingPackages/${merchantid}`, {
                headers: {
                    AuthToken: authToken
                }
            }).then (response => {
                //if merchant has booking package
                if (response.data !== undefined || response.data.length !== 0) {
                    for (var i in response.data) {
                        if (response.data[i].expired === false) {
                            var bookingPackageModelId = response.data[i].bookingPackageModelId
                            setBookingPackage(response.data[i])
    
                            axios.get(`/kiosk/${response.data[i].kioskId}`, {
                                headers: {
                                    AuthToken: authToken
                                }
                            }).then (r => {
                        
                                setKioskAddress(r.data.address)
                            })
    
                            axios.get(`/bookingPackageModel/${bookingPackageModelId}`, {
                                headers: {
                                    AuthToken: authToken
                                }
                            }).then( res => {
                    
                                setBookingPackageModel(res.data)
                          
                            }).catch(function (error) {
                            })
    
                            break;
                        }
                    }
                }
            }).catch(function (error) {
            })


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
                    var file = new File([res.data], {type:"image/png"})
                    let image = URL.createObjectURL(file)
                    setLogoToView(image)
                }).catch(function (error) {
                })
            }

            axios.get('/kiosks', {
                headers: {
                    AuthToken: authToken
                }
            }).then (r => {
                setKiosksToBuy(r.data)
            }).catch(function (error) {
            })
        }).catch(function (error) {
        })
    }, [authToken, merchantid, merchant])

    const onChangeName = e => {
        const name = e.target.value;
        setName(name)
        if (name.trim().length === 0) {
            setError("Name is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangeEmail = e => {
        const email = e.target.value;
        setEmail(email.trim())
        if (email.trim().length === 0) {
            setError("Email is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangeMobile = e => {
        const mobileNumber = e.target.value;
        
        if (mobileNumber.trim().length === 0) {
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
        if (floor.trim().length === 0) {
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
        if (unitNumber.trim().length === 0) {
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

        axios.put(`/merchant/${merchantid}`, {
            name: name,
            email: email,
            mobileNumber: mobileNumber,
            pointOfContact: pointOfContact,
            blk: blk,
            street: street,
            floor: floor,
            unitNumber: unitNumber,
            postalCode: postalCode,
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then((response) => {

            setName(response.data.name)
            setEmail(response.data.email)
            setMobileNumber(response.data.mobileNumber)
            setPointOfContact(response.data.pointOfContact)
            setBlk(response.data.blk)
            setStreet(response.data.street)
            setFloor(response.data.floor)
            setUnitNumber(response.data.unitNumber)
            setPostalCode(response.data.postalCode)
            setCreditBalance(response.data.creditBalance)
            merchant.creditBalance = (parseFloat(response.data.creditBalance).toFixed(2))
            localStorage.setItem('currentMerchant', JSON.stringify(merchant))
            
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

        var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
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
            isInModal(true)
            isError(false)
            isSuccessful(true)
            setMsg("Password successfully updated!")
            setCurrentPw('')
            setNewCfmPw('')
            setNewPw('')
        }).catch(function (error) {
            isInModal(true)
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }

    const reset = e => {
        e.preventDefault()
        setCurrentPw('')
        setNewPw('')
        setNewCfmPw('')
    }

    const addLogo = e => {

        e.preventDefault()

        //need to post the image first
        let formData = new FormData();
        formData.append(logoToAdd.name, logoToAdd)
        

        axios.post(`/merchantUploadLogo/${merchantid}`, formData, {

        }).then (res => {
            var file = new File([res.data.merchantLogoImage], {type:"image/png"})
            let image = URL.createObjectURL(file)
            setLogoToView(image)
            window.location.reload()
        }).catch(function (error) {
        })
    }

    const changeLogo = e => {
        e.preventDefault()

        //need to post the image first
        let formData = new FormData();
        formData.append(logoToChange.name, logoToChange)
      

        axios.post(`/merchantChangeLogo/${merchantid}`, formData, {
            headers: {
                AuthToken: authToken,
                'Content-Type': 'application/json'
            }
        }).then (res => {
            var file = new File([res.data.merchantLogoImage], {type:"image/png"})
            let image = URL.createObjectURL(file)
            setLogoToView(image)
            window.location.reload()
        }).catch(function (error) {
        })
    }

    const deleteLogo = e => {
        e.preventDefault()

        axios.post(`/merchantRemoveLogo/${merchantid}`, {
            headers: {
                AuthToken: authToken,
            }
        }).then(res => {
            window.location.reload()
        }).catch(function(error) {
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
        setTopUpAmount(topUpAmount)
    }

    const onChangeWithdrawAmount = e => {
        const withdrawAmount = e.target.value
        setWithdrawAmount(withdrawAmount)
    }

    const onChangePaypalEmail = e => {
        const email = e.target.value
        setPaypalEmail(email)
    }

    const onChangePackageKiosk = e => {
        const kiosk = e.target.value;
        let id = '';

        for (var i in kiosksToBuy) {
            let k = kiosksToBuy[i]
            if (k.address === kiosk) {
                id = k.id
                break;
            }
        }


        setBuyPackageKioskId(id)
        setBuyPackageKiosk(kiosk)
    }

    const withdrawCredits = e => {

        if (withdrawDisabled) {
            return
        }


        if (parseFloat(withdrawAmount) > parseFloat(creditBalance)) {
     
            isInModal(true)                                           
            setInWithdraw(true)
            setError('Not enough credits to withdraw.')
            isError(true)
            return
        }

        var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
        if (withdrawAmount === undefined || withdrawAmount === "" || !withdrawAmount.match(nums) ||
        withdrawAmount.indexOf('$') > 0) {    
            isInModal(true)                                           
            setInWithdraw(true)
            setError('Please input a valid price amount (e.g. 9.50).')
            isError(true)
            return
            }

        axios.post(`/withdraw/${merchantid}`, {
            amount: withdrawAmount,
            paypalEmail: paypalEmail,
            headers: {
                AuthToken: authToken,
            }
        }).then(res => {
            setWithdrawDisabled(true)
            window.location.reload()
        }).catch(function(error) {
            isInModal(true)                                           
            setInWithdraw(true)
            setError('Something went wrong, unable to withdraw credits.')
            isError(true)
        })
    }

    function formatDate(d) {
        if (d === undefined){
            d = (new Date()).toISOString()
        }
        let currDate = new Date(d);
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();
        let time = currDate.toLocaleTimeString('en-SG')

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return dt + "/" + month + "/" + year + " " + time ;
    }

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "7">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5">
                                    <small>Edit Profile</small>
                                    &nbsp;
                                    <span onClick={toggleTransaction}>
                                        <i class="fas fa-file-invoice-dollar"/>
                                    </span>
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div id="popover" className="text-center">
                                    {logoToView !== null &&
                                        <CardImg 
                                        style={{width:"7rem"}} 
                                        top src={logoToView} 
                                        alt='...'
                                        className='rounded-circle'
                                        />
                                    }
                                    {logoToView === null &&
                                        <CardImg style={{width:"7rem"}} top src={defaultLogo} alt='...'/>
                                    }               
                                </div>
                                <div>&nbsp;</div>
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
                                    {/* <p>&nbsp;</p>*/}
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Button color="success" size="sm" type="submit" onClick={updateProfile}>Update Profile</Button>
                                            {' '}
                                            <Button color="primary" size="sm" onClick={toggle}>Change Password</Button>
                                        </div>
                                    </Row>
                                    <p>{' '}</p>
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
                                    <CardTitle className="col-md-5" tag="h5">
                                        <small>Credit</small>
                                        <span>&nbsp;</span>
                                        <span onClick={toggleWithdraw}>
                                            <i class="fas fa-wallet"/>
                                        </span>
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody className='text-center'>
                                <div style={{fontSize:"1.2rem"}}>Current Balance: </div>
                                <div style={{fontSize:"2rem"}}>  
                                    $ {parseFloat(creditBalance).toFixed(2)}
                                </div>
                                <PayPalScriptProvider options ={{"client-id": "sb"}}>
                                    <FormGroup className='w-50 ml-auto mr-auto'>
                                        <Label for="inputTopUpAmount"></Label>
                                            <Input 
                                                type="text" 
                                                id="inputTopUpAmount" 
                                                placeholder="Enter Top-up Amount" 
                                                value={topUpAmount}
                                                onChange={onChangeTopUpAmount}
                                                style={{...padding(5, 5, 5, 5), fontSize:"0.7rem"}}
                                                />
                                    </FormGroup>
                                    <div style={{...padding(0,80,0,80)}}>
                                        <PayPalButtons style={{layout: "horizontal", shape:'pill', size: 'small', label: 'pay'}}
                                            currency = 'SGD' //doesn't work
                                            createOrder={function (data, actions) {
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: {
                                                            value: topUpAmount,
                                                            currency: 'SGD',
                                                            // currency_code: 'SGD'
                                                        },
                                                    }]
                                                });
                                            }}
                                            onClick={function() {
                                                var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
                                                if (topUpAmount === undefined || topUpAmount === "" || !topUpAmount.match(nums) ||
                                                topUpAmount.indexOf('$') > 0) {                                               
                                                    setInCredit(true)
                                                    setError('Please input a valid price amount (e.g. 9.50).')
                                                    isError(true)
                                                    }
                                            }}
                                            onError={function() {
                                                setInCredit(true)
                                                setError('Something went wrong, unable to top up credits')
                                                isError(true)
                                            }}
                                            onApprove={function() {
                                                merchant.creditBalance = parseFloat(merchant.creditBalance) + parseFloat(topUpAmount)
                                                localStorage.setItem('currentMerchant', JSON.stringify(merchant))
                                                axios.post(`/externalPaymentRecord/${merchantid}`, {
                                                    externalId: '56y789fh',
                                                    amount: topUpAmount
                                                },{
                                                    headers: {
                                                        AuthToken: authToken
                                                    }
                                                }).then(res => {
                                                    setInCredit(true)
                                                    isSuccessful(true)
                                                    setMsg('Credits topped-up successfully!')
                                                    window.location.reload()
                                                }).catch(function (error) {
                                                })  
                                            }}
                                        />
                                    </div>
                                </PayPalScriptProvider>
                                { inCredit && !inModal && err &&<UncontrolledAlert color="danger">{error}</UncontrolledAlert> }
                                { inCredit && !inModal && successful &&<UncontrolledAlert color="success">{successMsg}</UncontrolledAlert> }
                                &nbsp;&nbsp;&nbsp;
                            </CardBody>
                        </Card>
                        <Card className="card-name">
                            {bookingPackage !== '' &&
                                <CardHeader>
                                    <div className="form-row">
                                        <CardTitle className="col-md-10" tag="h5"><small>Current Booking Package</small></CardTitle>
                                    </div>
                                    {/* //duration name locker type */}
                                    <CardBody className='text-center'>
                                        <div>
                                            <i className="nc-icon nc-box fa-5x"/>
                                        </div> {' '} 
                                        <p className="mt-10"></p>
                                        <Button color="info" onClick={toggleBookingPackageDetails}>View Package</Button>
                                        <p>&nbsp;</p>
                                    </CardBody>
                                </CardHeader>
                            }
                            {bookingPackage === '' && 
                                <CardHeader>
                                    <div className="form-row">
                                        <CardTitle className="col-md-10" tag="h5"><small>Booking Package</small></CardTitle>
                                        <CardBody className='text-center'>
                                            <div>
                                                <i className="nc-icon nc-box fa-4x"/>
                                            </div> {' '} 
                                            <p className="mt-10"></p>
                                            {!pressed &&
                                                <>
                                                    <p><i><small>A Booking Package gives you unlimited locker usage for a period of time.</small></i></p>
                                                    <Button color="info" onClick={togglePressed}>Buy Package</Button>
                                                </>
                                            }
                                            {pressed && 
                                            <form>
                                                <FormGroup className="col-md-8 mr-auto ml-auto">
                                                    <Label for="inputKioskForPackage">Select Kiosk</Label>
                                                    <Input
                                                        type="select"
                                                        id="inputKioskForPackage"
                                                        value={buyPackageKiosk}
                                                        onChange={onChangePackageKiosk}
                                                    >
                                                        <option>[select]</option>
                                                        {
                                                            kiosksToBuy.map(kiosk => (
                                                                <option key={kiosk.id}>{kiosk.address}</option>
                                                            ))
                                                        }
                                                    </Input>
                                                </FormGroup>  
                                                <Button color="primary"  onClick={() => {
                                                    if (buyPackageKioskId !== ""){
                                                        localStorage.setItem('buyPackageKioskId', buyPackageKioskId)
                                                        history.push('/admin/chooseBookingPackageModel')
                                                    }
                                                }}>
                                                    Continue &nbsp;
                                                    <i className="fas fa-arrow-right"/>
                                                </Button>                         
                                            </form>
                                            }
                                            <p>{' '}</p>
                                        </CardBody>
                                    </div>
                                </CardHeader>
                            }
                            <Modal isOpen={bookingPackageDetailsModal} toggle={toggleBookingPackageDetails}>
                                <ModalHeader toggle={toggleBookingPackageDetails}>Booking Package Details</ModalHeader>
                                <ModalBody>
                                    <form>
                                        <fieldset disabled>
                                            <FormGroup>
                                                <Label for="packageName">Booking Package Name</Label>
                                                <Input 
                                                    type="text" 
                                                    id="packageName" 
                                                    placeholder="Name" 
                                                    value={bookingPackageModel.name}
                                                    readOnly
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="packageDescription">Booking Package Description</Label>
                                                <Input 
                                                    type="textarea" 
                                                    id="packageDescription" 
                                                    placeholder="Description" 
                                                    value={bookingPackageModel.description}
                                                    readOnly
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                            <FormGroup>
                                                <Label for="packageKiosk">Kiosk</Label>
                                                <Input 
                                                    type="text" 
                                                    id="packageKiosk" 
                                                    placeholder="kiosk" 
                                                    value={kioskAddress}
                                                    readOnly
                                                />
                                                </FormGroup>
                                            </FormGroup>
                                            <Row>
                                                <FormGroup className="col-md-6">
                                                    <Label for="packageQuota">Package Locker Quota</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="packageQuota" 
                                                        placeholder="Quota" 
                                                        value={bookingPackageModel.quota}
                                                        readOnly
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="lockerUsage">Your Locker Usage</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="lockerUsage" 
                                                        placeholder="Quota" 
                                                        value={bookingPackage.lockerCount + "/" + bookingPackageModel.quota}
                                                        readOnly
                                                    />
                                                </FormGroup>
                                            </Row>
                                            <Row>
                                                <FormGroup className="col-md-6">
                                                    <Label for="packageStart">Date Bought</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="packageStart" 
                                                        placeholder="Start Date" 
                                                        value={formatDate(bookingPackage.startDate)}
                                                        readOnly
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="packageExpiry">Expiry Date</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="packageExpiry" 
                                                        placeholder="Expiry Date" 
                                                        value={formatDate(bookingPackage.endDate)}
                                                        readOnly
                                                    />
                                                </FormGroup>
                                            </Row>
                                        </fieldset>
                                    </form>
                                </ModalBody>
                            </Modal>
                            <Modal isOpen={withdrawModal} toggle={toggleWithdraw}>
                                <ModalHeader toggle={toggleWithdraw}>Withdraw Credits</ModalHeader>
                                <ModalBody className='text-center'>
                                    <div style={{fontSize:"1rem"}}>Current Balance: $ {parseFloat(creditBalance).toFixed(2)}</div>
                                    <form className='text-center'>
                                        <FormGroup className='w-50 mr-auto ml-auto text-center'>
                                            <Label for="inputPaypalEmail"></Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputPaypalEmail" 
                                                    placeholder="Enter PayPal Email" 
                                                    value={paypalEmail}
                                                    onChange={onChangePaypalEmail}
                                                    style={{...padding(5, 5, 5, 5), fontSize:"0.7rem"}}
                                                    />
                                        </FormGroup>
                                        <FormGroup className='w-50 mr-auto ml-auto text-center'>
                                                <Input 
                                                    type="text" 
                                                    id="inputWithdrawAmount" 
                                                    placeholder="Enter Withdraw Amount" 
                                                    value={withdrawAmount}
                                                    onChange={onChangeWithdrawAmount}
                                                    style={{...padding(5, 5, 5, 5), fontSize:"0.7rem"}}
                                                    />
                                        </FormGroup>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={withdrawCredits} disabled={withdrawDisabled} >Withdraw</Button>{' '}
                                </ModalFooter>
                                { inModal && !inWithdraw && err &&<Alert color="danger">{error}</Alert> }
                            </Modal>
                            <Modal isOpen={transactionModal} toggle={toggleTransaction} size="lg">
                                <ModalHeader toggle={toggleTransaction}>View Transaction History</ModalHeader>
                                <ModalBody>
                                    <TransactionHistory/>
                                </ModalBody>
                            </Modal>
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