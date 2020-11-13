import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Boxes from '../../assets/img/boxes.png';
import ChooseKiosk from '../../assets/img/chooseKiosk.png';
import DateTime from '../../assets/img/datetime.png';
import Checkout from '../../assets/img/checkout.png';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    CardHeader, FormGroup, Label, Button, Modal, ModalHeader, ModalFooter, ModalBody,
    CardImg,
    CardText,
    Breadcrumb,
    BreadcrumbItem,
    Alert,
    UncontrolledAlert,
    Table
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function CreateBooking() {
    
    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))
    const merchantid = parseInt(Cookies.get('merchantUser'))

    var today = new Date()

    const [page, setPage] = useState(1)

    const [kiosks, setKiosks] = useState([])
    const [kiosk, setKiosk] = useState('')
    const [kioskId, setKioskId] = useState('')
    const [kioskAddress, setKioskAddress] = useState()
    const [lockerTypes, setLockerTypes] = useState([])
    const [lockerTypeId, setLockerTypeId] = useState(null)
    const [lockerTypeName, setLockerTypeName] = useState(null)

    const [bookingPackage, setBookingPackage] = useState(null)
    const [bookingPackageModel, setBookingPackageModel] = useState(null)

    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date(2020,11,5,0,0,0))
    const [startDateTime, setStartDateTime] = useState(new Date())
    const [endDateTime, setEndDateTime] = useState(new Date())
    const [check, setCheck] = useState(null)

    const [validBookingPackage, setValidBookingPackage] = useState(true)
    const [quotaNotReached, setQuotaNotReached] = useState(true)
    const [lockerTypeDifferent, setLockerTypeDifferent] = useState(false)

    const [totalPrice, setTotalPrice] = useState(null)
    const [minutesChargeable, setMinutesChargeable] = useState(null)
    const [pricePerMin, setPricePerMin] = useState(null)

    const [error, setError] = useState('')
    const [isError, setIsError] = useState(false)

    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal);

    //booking source enum is 'Web'

    useEffect(() => {

        axios.get('/kiosks', {
            headers: {
                AuthToken: authToken
            }
        }).then (r => {
            setKiosks(r.data)
        }).catch(function (error) {
            console.log(error)
        })
        if (kioskId !== '') {
            axios.get(`/lockerType/kiosk/${kioskId}`, {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setLockerTypes(res.data)
            }).catch (function(error) {
                console.log(error)
            })
        }
        
        axios.get(`/merchantBookingPackage/${merchantid}`, {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setBookingPackage(res.data)
            let bookingPackage = res.data
            if (bookingPackage !== null) {
                axios.get(`/bookingPackageModel/${res.data.bookingPackageModelId}`, {
                    headers: {
                        AuthToken: authToken
                    }
                }).then (response => {                 
                    setBookingPackageModel(response.data)
                })
            }

        }).catch (function(error) {
            console.log(error)
        })
                
        configureStartDateTime()

    }, [kioskId, page, startDate, startTime])

    const onChangeKiosk = e => {
        const kiosk = e.target.value
        console.log(kiosk)
        setKiosk(kiosk)
        let id = ''
        for (var i in kiosks) {
            if (kiosks[i].address === kiosk) {
                id = kiosks[i].id
                setKioskAddress(kiosk)
                console.log(id)
                break;
            }
        }
        setKioskId(id)
    }

    const changePageOne = e => {
        setPage(1)
    }

    const changePageTwo = e => {
        setPage(2)
    }

    const changePageThree = e => {
        console.log("start dt: " + startDateTime)
        console.log("end dt : " + endDateTime)
        setPage(3)
    }

    //e.g. Fri Nov 20 2020 13:35:00 GMT+0800 (Singapore Standard Time)
    const onChangeStartDate = date => {
        console.log(date)
        setStartDate(date)
        setCheck(date)

        var d = new Date(date)
        if (new Date(d) < new Date(today)) {
            setError("You cannot choose a date that has passed.")
            setIsError(true)
        } else if (d > today.setDate(today.getDate() + 14)) {
            setError("You cannot choose a date that is more than 2 weeks in the future.")
            setIsError(true)
        } else {
            setIsError(false)
        }
    }
    //e.g. Wed Jan 01 2020 04:34:00 GMT+0800 (Singapore Standard Time)
    const onChangeStartTime = (e, date) => {
        console.log(date)
        let amOrPm = (date.split(' ')[1])
        console.log(amOrPm)
        let baseHour = 0
        if (amOrPm === "PM") {
            baseHour = 12
        }
        let timeArray = (date.split(' '))[0].split(':')
        console.log(timeArray)
        let hour = baseHour + parseInt(timeArray[0])
        let startTime = new Date(2020, 0, 1, hour, parseInt(timeArray[1]), 0)
        let time = startTime.toLocaleTimeString('en-SG')
        console.log(time)
        console.log(startTime)
        setStartTime(startTime)
    }

    const configureStartDateTime = e => {

        console.log("start datetime: " + startDateTime)
        console.log("end datetime: " + endDateTime)
        console.log("check: " + check)

        //configure start datetime
        console.log(startDate)
        let datePart = new Date(startDate)
        let year = datePart.getFullYear()
        let month = datePart.getMonth() 
        let day = datePart.getDate()

        let timePart = new Date(startTime)
        let timeArr = (timePart.toLocaleTimeString('en-SG')).split(':')
        let combinedStartDate = new Date(year, month, day, timeArr[0], timeArr[1], 0)
        console.log(combinedStartDate)
        setStartDateTime(combinedStartDate.setSeconds(0,0))

        //calculate end time (48 hours)
        let endDate = new Date(combinedStartDate)
        endDate.setDate(combinedStartDate.getDate() + 2)
        endDate = endDate.setSeconds(0,0)
        console.log(endDate)
        setEndDateTime(endDate)

        if (bookingPackage !== null) {
            let bookingPackageEnd = new Date(bookingPackage.endDate)
            bookingPackageEnd = bookingPackageEnd.setSeconds(0,0)
            console.log("booking package end: " + bookingPackageEnd)
            console.log("end date: " + endDate)
            //CHECK IF booking package ends before the end time 
            if (bookingPackageEnd < endDate) {
                setValidBookingPackage(false)
                //BUT set booking package to valid if start date is after it expires
                if (combinedStartDate.setSeconds(0,0) > bookingPackageEnd) {
                    setValidBookingPackage(true)
                }
            } else{
                setValidBookingPackage(true)
            }
        }
    }

    const transitionPageThree = e => {
        e.preventDefault()
        calculateTotalCost()

        changePageThree()
    }

    const calculateTotalCost = e => {

        axios.get(`/lockerType/${lockerTypeId}`, {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("get locker type by id axios thru")
            let pricePerMin = parseFloat((res.data.pricePerHalfHour)/30).toFixed(2)
            console.log(pricePerMin)
            setPricePerMin(pricePerMin)

            let totalPrice = 0

            console.log("start date time: " + new Date(startDateTime).setSeconds(0,0))
            console.log("booking package end date: " + new Date(bookingPackage.endDate).setSeconds(0,0))

            //package ends before booking end time
            if (!validBookingPackage && quotaNotReached && !lockerTypeDifferent) { 
                console.log('first case')
                let start = new Date(startDateTime)
                console.log(start)
                let end = new Date(endDateTime)
                console.log(end)
                let bookingPackageEnd = new Date((bookingPackage.endDate)).setSeconds(0,0)
                console.log(bookingPackageEnd)
                let milliscs = Math.abs(end - bookingPackageEnd)
                console.log(milliscs)
                var diffMins = Math.floor(milliscs / 60000);
                console.log(diffMins)
                setMinutesChargeable(diffMins)
                totalPrice = parseFloat((diffMins-30)*pricePerMin).toFixed(2)
                console.log(totalPrice)
                setTotalPrice(totalPrice.toFixed(2))
            } else if (validBookingPackage && (new Date(startDateTime).setSeconds(0,0) > new Date(bookingPackage.endDate).setSeconds(0,0))){ //booking package has expired
                console.log('second case')
                totalPrice = parseFloat(2850*pricePerMin).toFixed(2)
                console.log(totalPrice)
                setMinutesChargeable(2880)
                setTotalPrice(totalPrice)
            } else if (validBookingPackage && quotaNotReached && !lockerTypeDifferent ) { //cost covered, $0
                console.log('third case')
                setMinutesChargeable(2880)
                console.log(totalPrice)
                setTotalPrice(totalPrice)
            } else {
                console.log('fourth case')
                //only need to calculate default 48 h
                totalPrice = parseFloat(2850*pricePerMin).toFixed(2)
                console.log(totalPrice)
                setMinutesChargeable(2880)
                setTotalPrice(totalPrice)
            }

            axios.post('/checkBookingAllowed', {
                startDate: startDateTime,
                endDate: endDateTime,
                lockerTypeId: lockerTypeId,
                kioskId: kioskId
            },
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                console.log("check booking allowed axios through")
                if (res.data === true) {
                    changePageThree()
                } else if (res.data === false || res.data.length === 0) {
                    setError('No lockers are available from your specified Start Date to the End Date 48 hours later. Please pick another date.')
                    setIsError(true)
                } 
            }).catch (function(error) {
                console.log(error)
            })


        }).catch (function(error) {
            console.log(error)
        })
    }

    const transitionPageTwo = (e, id, name) => {
        e.preventDefault()
        console.log("locker type id: " + id)
        console.log("locker type name: " + name)
        setLockerTypeId(id)
        setLockerTypeName(name)

        console.log('booking package model locker type id: ' + bookingPackageModel.lockerTypeId)
        //if merchant has booking package
        if (bookingPackage !== null) {
            //check if locker type is same as selected
            if (bookingPackageModel.lockerTypeId === id) {
                console.log('booking package locker type id: ' + bookingPackageModel.lockerTypeId)
                setLockerTypeDifferent(false)
                //check if booking package is valid to be used:
                //if quota reached
                if (parseInt(bookingPackageModel.quota) === parseInt(bookingPackage.lockerCount)) {
                    setQuotaNotReached(false)
                } else {
                    setQuotaNotReached(true)
                }
            //locker type is not the same
            } else {
                setLockerTypeDifferent(true)
            }
        }
        changePageTwo()
    }

    const buyBooking = e => {
        axios.post(`/booking/merchant`, {
            startDate: startDateTime,
            endDate: endDateTime,
            bookingSourceEnum: 'Web',
            merchantId: merchantid,
            lockerTypeId: lockerTypeId,
            kioskId: kioskId,
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {

            merchant.creditBalance = parseFloat(merchant.creditBalance) - totalPrice
            localStorage.setItem('currentMerchant', JSON.stringify(merchant))

            axios.put('/tagOrderToBooking', {
                bookingId: res.data.id,
                orderId: JSON.parse(localStorage.getItem('orderToView')),
            }, 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then (response => {
                history.push('/admin/bookings')
            }).catch(function (error) {
                console.log(error)
            })
        }).catch(function (error) {
            console.log(error.response.data)
        })  
    }

    function formatDate(d) {
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
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

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbItem><a href='/admin/orderDetails'>Order Details</a></BreadcrumbItem>
                            {page === 1
                                ? <BreadcrumbItem active>Steps 1 & 2</BreadcrumbItem>
                                : <BreadcrumbItem><a onClick={changePageOne} href='#'>Steps 1 & 2</a></BreadcrumbItem>
                            } 
                            {page === 2 || page === 1
                                ? <BreadcrumbItem active>Step 3</BreadcrumbItem>
                                : <BreadcrumbItem><a onClick={changePageTwo} href='#'>Step 3</a></BreadcrumbItem>
                            }
                            {page === 3 || (page === 1 || page ===2 )
                                ? <BreadcrumbItem active>Step 4</BreadcrumbItem>
                                : <BreadcrumbItem><a onClick={changePageThree} href='#'>Step 4</a></BreadcrumbItem>
                            }
                        </Breadcrumb>
                    </div>
                    <Row>
                        {page === 1 &&
                            <>
                                <Col md = "6">
                                    <Card className="card-name">
                                        <CardHeader>
                                            <p>&nbsp;</p>
                                            <div className="form-row text-center">
                                                <CardTitle className="col-md-12" tag="h5"><small>Step 1: Choose Kiosk to Book</small></CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="text-center">
                                                <CardImg style={{width:"15rem"}} top src={ChooseKiosk} alt='...'/>
                                            </div>
                                            <p>&nbsp;</p>
                                            <FormGroup>
                                                <Label for="inputKiosk">Kiosk</Label>
                                                <Input 
                                                    type="select" 
                                                    id="inputKiosk" 
                                                    placeholder="Kiosk" 
                                                    value={kiosk}  
                                                    onChange={onChangeKiosk}                                                  
                                                >
                                                    <option>[select]</option>
                                                    {
                                                        kiosks.map(kiosk => (
                                                            <option key={kiosk.id}>{kiosk.address}</option>
                                                        ))
                                                    }
                                                </Input>
                                            </FormGroup> 
                                            <p>&nbsp;</p> 
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col  md = "6">
                                    <Card className="card-name">
                                        <CardHeader>
                                            <p>&nbsp;</p>
                                            <div className="form-row text-center">
                                                <CardTitle className="col-md-12" tag="h5"><small>Step 2: Choose a Locker Type</small></CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardBody className="text-center">
                                            <div className="text-center">
                                                <CardImg style={{width:"15rem"}} top src={Boxes} alt='...'/>
                                            </div>
                                            {
                                                lockerTypes.map(lockerType => (
                                                    <div className="text-center" key={lockerType.id}>
                                                        <Button className="btn-link" color="primary" onClick={e => transitionPageTwo(e, lockerType.id, lockerType.name)}>{lockerType.name}</Button>
                                                    </div>
                                                ))
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                            </>
                        }
                        {page === 2 && 
                            <>
                                <Col md = "12">
                                    <Card className="card-name">
                                        <CardHeader>
                                            <p>&nbsp;</p>
                                            <div className="form-row text-center">
                                                <CardTitle className="col-md-12" tag="h5"><small>Step 3: Select Date and Time</small></CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardBody className="text-center mr-auto ml-auto" style={{alignItems: 'center'}}>
                                            <div className="text-center">
                                                <CardImg style={{width:"15rem"}} top src={DateTime} alt='...'/>
                                            </div>
                                            <p>{' '}</p>
                                            <div>
                                                <Row className="text-center">
                                                    {!validBookingPackage && bookingPackage.kioskId === kioskId && quotaNotReached && !lockerTypeDifferent && check !== null &&
                                                    <Alert color="info" className="text-center mr-auto ml-auto" style={{...padding(10,5,0,5)}}>
                                                        <span>
                                                            <p>
                                                            <i className="nc-icon nc-alert-circle-i"/>&nbsp;
                                                            <small>Your Booking Package expires before the Booking End Time. Expiry Date: {formatDate(bookingPackage.endDate)}. <br/> You will have to pay for the excess time beyond that.</small></p>
                                                        </span>
                                                    </Alert>
                                                    }
                                                    {!quotaNotReached && bookingPackage.kioskId === kioskId &&
                                                    <Alert color="info" className="text-center mr-auto ml-auto" style={{...padding(10,5,0,5)}}>
                                                        <span>
                                                            <p>
                                                            <i className="nc-icon nc-alert-circle-i"/>&nbsp;
                                                            <small>Your Booking Package cannot be used as your locker quota has been used up. This booking will be paid for in credits.</small></p>
                                                        </span>
                                                    </Alert>
                                                    }
                                                    {lockerTypeDifferent && bookingPackage.kioskId === kioskId &&
                                                    <Alert color="info" className="text-center mr-auto ml-auto" style={{...padding(10,5,0,5)}}>
                                                        <span>
                                                            <p>
                                                            <i className="nc-icon nc-alert-circle-i"/>&nbsp;
                                                            <small>Your Booking Package cannot be used as the locker type chosen is not covered by it.</small></p>
                                                        </span>
                                                    </Alert>
                                                    }
                                                </Row>
                                                <Row>
                                                    <p className="text-center mr-auto ml-auto"><small><i>Promo: Enjoy your first 30 minutes free!</i></small></p>
                                                </Row>
                                                <Row className="text-center">
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Col>   
                                                            <KeyboardDatePicker
                                                                disableToolbar
                                                                variant="inline"
                                                                format="dd/MM/yyyy"
                                                                margin="normal"
                                                                label="Select Booking Start Date"
                                                                id="date-picker-inline"
                                                                value={startDate}
                                                                onChange={onChangeStartDate}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                            />
                                                            <div>&nbsp;</div>
                                                            <KeyboardTimePicker
                                                                noValidate
                                                                margin="normal"
                                                                id="time-picker"
                                                                value={startTime}
                                                                label="Select Booking Start Time"
                                                                onChange={onChangeStartTime}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change time',
                                                                }}
                                                            />   
                                                        </Col>                                                  
                                                    </MuiPickersUtilsProvider>
                                                </Row>
                                            </div>
                                            { isError &&<UncontrolledAlert color="danger">{error}</UncontrolledAlert> }
                                            <p>{' '}</p>
                                            <Button className="text-center mr-auto ml-auto" onClick={e => transitionPageThree(e)}>
                                                Next &nbsp;
                                                <i className="fas fa-arrow-right"/>
                                            </Button>
                                            <p>&nbsp;</p>
                                            <p><i><small>**Your Booking will end at a default 48 hours from the selected Start Time so as to faciliate a better experience for customers.</small></i></p>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </>
                        }
                        {page === 3 &&
                            <>
                                <Col md = "12">
                                    <Card className="card-name">
                                        <CardHeader>
                                            <p>&nbsp;</p>
                                            <div className="form-row text-center">
                                                <CardTitle className="col-md-12" tag="h5"><small>Step 4: Checkout</small></CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md='6'>
                                                    <div className="text-center">
                                                        <CardImg style={{width:"15rem"}} top src={Checkout} alt='...'/>
                                                    </div>
                                                </Col>
                                                <Col md='6'>
                                                    <div className="text-center">
                                                        <p>&nbsp;</p>
                                                        <CardText tag='h6'>
                                                            New Booking
                                                        </CardText>
                                                        <p>{' '}</p>
                                                        <CardText>Kiosk: {kioskAddress}</CardText>
                                                        <CardText>Locker Type: {lockerTypeName}</CardText>
                                                        <CardText>Start: {formatDate(startDateTime).toString()}</CardText>
                                                        <CardText>End: {formatDate(endDateTime).toString()}</CardText>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <p>&nbsp;</p>
                                            <Row>
                                                <div className="text-center mr-auto ml-auto">
                                                    <CardText style={{color:'grey'}}>Cost Summary</CardText>
                                                    <Table size="sm" borderless>  
                                                        <tbody>
                                                            <tr>
                                                                <td style={{textAlign:'left'}}>Minutes Chargeable: </td>
                                                                <td style={{textAlign:'right'}}>{minutesChargeable} - 30 (Free) = {parseInt(minutesChargeable-30)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{textAlign:'left'}}>Locker Cost/min:</td>
                                                                <td style={{textAlign:'right'}}>$ {pricePerMin}</td>
                                                            </tr>
                                                            <tr>
                                                                <th style={{textAlign:'left'}} scope="row"></th>
                                                                <td style={{textAlign:'right'}}><b>Total: $ {totalPrice}</b></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                    <CardText className="text-center mr-auto ml-auto" style={{color:'grey'}}>Payment</CardText>
                                                    <Table size="sm" borderless>  
                                                        <tbody>
                                                            <tr>
                                                                <th style={{textAlign:'left'}} scope="row"></th>
                                                                <td style={{textAlign:'right'}}>Account Credit: $ {parseFloat(merchant.creditBalance).toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <th style={{textAlign:'left'}} scope="row"></th>
                                                                <td style={{textAlign:'right'}}>Price: -$ {totalPrice}</td>
                                                            </tr>
                                                            <tr>
                                                                <th style={{textAlign:'left'}} scope="row"></th>
                                                                <td style={{textAlign:'right'}}><b>Account Balance: $ {(parseFloat(merchant.creditBalance).toFixed(2) - totalPrice).toFixed(2)}</b></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Row>
                                            <p>{' '}</p>
                                            <div className='text-center'>
                                                <Button disabled={parseFloat(merchant.creditBalance) < totalPrice} onClick={toggle}>Checkout</Button>
                                                {parseFloat(merchant.creditBalance) < totalPrice &&
                                                    <p style={{color: 'red'}}><i><small>You do not have enough credits to purchase this booking. Please go to your profile to top-up.</small></i></p>
                                                }   
                                            </div>
                                        </CardBody>
                                        <Modal isOpen={modal} toggle={toggle}>
                                            <ModalHeader toggle={toggle}>Confirm Booking?</ModalHeader>
                                                <ModalBody>
                                                    Payment will be made in credits.
                                                </ModalBody>
                                            <ModalFooter>
                                                <Button color="info" onClick={(e) => {buyBooking(e)}}>Confirm</Button>{' '}
                                            </ModalFooter>
                                        </Modal>
                                    </Card>
                                </Col>
                            </>
                        }
                    </Row>
                </div>
            </ThemeProvider>
        </>
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


export default CreateBooking;