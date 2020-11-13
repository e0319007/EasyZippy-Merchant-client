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
    UncontrolledAlert
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
    console.log(authToken)

    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))
    const merchantid = parseInt(Cookies.get('merchantUser'))

    var today = new Date()

    const [page, setPage] = useState(1)

    const [kiosks, setKiosks] = useState([])
    const [kiosk, setKiosk] = useState('')
    const [kioskId, setKioskId] = useState('')
    const [lockerTypes, setLockerTypes] = useState([])
    const [lockerTypeId, setLockerTypeId] = useState(null)

    const [bookingPackage, setBookingPackage] = useState(null)
    const [bookingPackageModel, setBookingPackageModel] = useState(null)

    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date(2020,11,5,0,0,0))
    const [startDateTime, setStartDateTime] = useState(new Date())
    const [endDateTime, setEndDateTime] = useState(new Date())

    const [validBookingPackage, setValidBookingPackage] = useState(true)
    const [quotaNotReached, setQuotaNotReached] = useState(true)
    const [lockerTypeDifferent, setLockerTypeDifferent] = useState(false)

    const [totalPrice, setTotalPrice] = useState(null)
    const [minutesChargeable, setMinutesChargeable] = useState(null)

    const [error, setError] = useState('')
    const [isError, setIsError] = useState(false)

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
            console.log(res.data.lockerCount)
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

    }, [kioskId, page, startDate])

    const onChangeKiosk = e => {
        const kiosk = e.target.value
        console.log(kiosk)
        setKiosk(kiosk)
        let id = ''
        for (var i in kiosks) {
            if (kiosks[i].address === kiosk) {
                id = kiosks[i].id
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
        setPage(3)
    }

    //e.g. Fri Nov 20 2020 13:35:00 GMT+0800 (Singapore Standard Time)
    const onChangeStartDate = date => {
        console.log(date)
        var d = new Date(date)
        if (d < today) {
            setError("You cannot choose a date that has passed.")
            isError(true)
        } else if (d > today.getDate() + 14) {
            setError("You cannot choose a date that is more than 2 weeks in the future.")
            isError(true)
        } 

        configureStartDateTime()
        setStartDate(date)
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

        configureStartDateTime()

        setStartTime(startTime)
    }

    const configureStartDateTime = e => {
        //configure start datetime
        let datePart = new Date(startDate)
        let year = datePart.getFullYear()
        let month = datePart.getMonth() 
        let day = datePart.getDate()

        let timePart = new Date(startTime)
        let timeArr = (timePart.toLocaleTimeString('en-SG')).split(':')

        let combinedStartDate = new Date(year, month, day, timeArr[0], timeArr[1], 0)
        console.log(combinedStartDate)
        setStartDateTime(combinedStartDate)

        //calculate end time (48 hours)
        let endDate = combinedStartDate
        endDate.setDate(endDate.getDate() + 2)
        console.log(endDate)
        setEndDateTime(endDate)

        if (bookingPackage !== null) {
            //CHECK IF booking package ends before the end time
            let bookingPackageEnd = new Date(bookingPackage.endDate)
            console.log(bookingPackage.endDate)
            console.log(bookingPackageEnd < endDate)
            if (!bookingPackageEnd < endDate) {
                setValidBookingPackage(false)
                console.log(validBookingPackage)
                console.log(endDate - bookingPackageEnd)
            } else {
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

            let totalPrice = 0

            //package ends before booking end time
            if (!validBookingPackage && quotaNotReached && !lockerTypeDifferent) { 
                let start = new Date(startDateTime)
                console.log(start)
                let end = new Date(endDateTime)
                console.log(end)
                let bookingPackageEnd = new Date(bookingPackage.endDate)
                console.log(bookingPackageEnd)
                let milliscs = Math.abs(end - bookingPackageEnd)
                console.log(milliscs)
                var diffMins = Math.floor(milliscs / 60000);
                console.log(diffMins)
                setMinutesChargeable(diffMins)
                totalPrice = parseFloat(diffMins*pricePerMin).toFixed(2)
                console.log(totalPrice)
                setTotalPrice(totalPrice)
            } else if (validBookingPackage && quotaNotReached && !lockerTypeDifferent) { //cost covered, $0
                setMinutesChargeable(2880)
                console.log(totalPrice)
                setTotalPrice(totalPrice)
            } else {
                //only need to calculate default 48 h
                totalPrice = parseFloat(48*60*pricePerMin).toFixed(2)
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
                } else {
                    setError('No lockers are available from your specified Start Date to the End Date 48 hours later')
                    isError(true)
                } 
            }).catch (function(error) {
                console.log(error)
            })


        }).catch (function(error) {
            console.log(error)
        })
    }

    const transitionPageTwo = (e, id) => {
        e.preventDefault()
        console.log("locker type id: " + id)

        setLockerTypeId(id)

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

    function formatDate(d) {
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        console.log("currDate: " + currDate)
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
                                                        <Button className="btn-link" color="primary" onClick={e => transitionPageTwo(e, lockerType.id)}>{lockerType.name}</Button>
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
                                                    {!validBookingPackage && bookingPackage.kioskId === kioskId && quotaNotReached && !lockerTypeDifferent &&
                                                    <Alert color="info" className="text-center mr-auto ml-auto" style={{...padding(10,5,0,5)}}>
                                                        <span>
                                                            <p>
                                                            <i className="nc-icon nc-alert-circle-i"/>&nbsp;
                                                            <small>Your Booking Package expires before the Booking End Time at {formatDate(bookingPackage.endDate)}. <br/> You will have to pay for the excess time beyond that.</small></p>
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
                                                <CardText tag="h5">New Booking</CardText>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="text-center">
                                                <CardImg style={{width:"15rem"}} top src={Checkout} alt='...'/>
                                            </div>
                                            <p>{' '}</p>
                                            
                                        </CardBody>
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