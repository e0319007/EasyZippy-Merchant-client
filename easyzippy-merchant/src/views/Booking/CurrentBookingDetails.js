import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    CardHeader, FormGroup, Label, Button, Modal, ModalHeader, ModalFooter,
    Alert

} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function CurrentBookingDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    
    const [qrCodeString, setQrCodeString] = useState(JSON.parse(localStorage.getItem('qrCode'))) 
    var React = require('react');
    var QRCode = require('qrcode.react');

    const bookingId = JSON.parse(localStorage.getItem('bookingToView'))
    const [data, setData] = useState([])
    const [bookingPackages, setBookingPackages] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])
    const [kiosks, setKiosks] = useState([])

    const [startDate, setStartDate] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    //for delete confirmation
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)


    useEffect(() => {
        axios.get(`/booking/${bookingId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            setQrCodeString(res.data.qrCode)

            setStartDate(res.data.startDate)

            axios.get("/bookingPackageModels", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setBookingPackages(res.data)
            }).catch ()

            axios.get("/lockerTypes", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setLockerTypes(res.data)
            }).catch()

            axios.get("/kiosks", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setKiosks(res.data)
            }).catch()

        }).catch (function(error) {
        })
    },[authToken,bookingId])

    const cancelBooking = e => {
        e.preventDefault()
    
        var currentDate = new Date()
        var currentTime = currentDate.getTime()

        var startd = new Date(startDate)
        var startTime = startd.getTime()

        var diffTime = startTime - currentTime 

        if (diffTime <= 1800000) {
            isError(true)
            setError("Unable to cancel booking less than 30 minutes before the start of booking start time")
            isSuccessful(false)
            return;
        }

        axios.put(`/booking/${bookingId}`, 
        {
            id: bookingId
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
        
            isError(false)
            isSuccessful(true)
            setMsg("Booking successfully cancelled!")
        }).catch(function (error) {
        })
    }


    //match booking package id to booking package name
    function getBookingPackage(id) {
        for (var i in bookingPackages) {
            if (bookingPackages[i].id === id) {
                return bookingPackages[i].name
            }
        }
    }

    //match lockertype id to locker type name
    function getLockerType(id) {
        for (var i in lockerTypes) {
            if (lockerTypes[i].id === id) {
                return lockerTypes[i].name
            }
        }
    }

    //match kiosk id to kiosk address 
    function getKiosk(id) {
        for (var i in kiosks) {
            if (kiosks[i].id === id) {
                return kiosks[i].address
            }
        }
    }

    // to use when viewing 
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
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Booking Details: {data.id} </CardTitle>
                                    </div>
                                    {qrCodeString !== null &&
                                        <div className='text-center'>
                                            <QRCode style={{height:'10rem', width: '10rem'}} value={qrCodeString} />
                                        </div>
                                    }
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled> 
                                            <div className="form-row">
                                            <FormGroup className="col-md-6">
                                                <Label for="inputId">Booking Id</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="id number here"
                                                    value={data.id}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-6">
                                                <Label for="inputId">Order Id (if any)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="-"
                                                    value={data.orderId}
                                                />
                                            </FormGroup>
                                            </div>
                                            
                                            <div className="form-row">
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputBookingStatus">Booking Status</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputBookingStatus"
                                                        placeholder="Status"
                                                        value={data.bookingStatusEnum}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputBookingSource">Booking Source</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputBookingSource"
                                                        placeholder="Booking Source"
                                                        value={data.bookingSourceEnum}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputBookingPackage">Booking Package (if any)</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputBookingPackage"
                                                        placeholder="-"
                                                        value={getBookingPackage(data.bookingPackageId)}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                            <FormGroup className="col-md-6">
                                                <Label for="inputPrice">Price (if any)</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputPrice"
                                                    placeholder="-"
                                                    value={data.bookingPrice}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-6">
                                                    <Label for="inputPromoIdUsed">Promotion Id Used (if any)</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputPromoIdUsed"
                                                        placeholder="-"
                                                        value={data.promoIdUsed}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStartDate">Start Date</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputStartDate"
                                                        placeholder="Start Date"
                                                        value={formatDate(data.startDate)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEndDate">End Date</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputEndDate"
                                                        placeholder="End Date"
                                                        value={formatDate(data.endDate)}
                                                    />
                                                </FormGroup>
                                            </div> 
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputLockerType">Locker Type</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputLockerType"
                                                        placeholder="Locker Type"
                                                        value={getLockerType(data.lockerTypeId)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputKiosk">Kiosk</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputKiosk"
                                                        placeholder="Kiosk"
                                                        value={getKiosk(data.kioskId)}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <FormGroup>
                                                <Label for="inputCreatedAt">Created On</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputCreatedAt"
                                                    placeholder="Created On"
                                                    value={formatDate(data.createdAt)}
                                                />
                                            </FormGroup>                 
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="danger" size="sm" onClick={toggle}>Cancel Booking</Button>                                              
                                            </div>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/Bookings')
                                                        localStorage.removeItem('bookingToView')
                                                        localStorage.removeItem('qrCode')
                                                    }}> back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>
                                <Modal isOpen={modal} toggle={toggle}>
                                    <ModalHeader toggle={toggle}>Are you sure you want to cancel this booking?</ModalHeader>
                                    <ModalFooter style={{display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"}}>
                                            <Button color="danger" onClick={cancelBooking}>Yes</Button>
                                            {'  '}
                                            <Button color="secondary" onClick={toggle}>No</Button>
                                    </ModalFooter>
                                </Modal>
                                { err &&<Alert color="danger">{error}</Alert> }
                                { successful &&<Alert color="success">{successMsg}</Alert>} 
                                
                            </Card>         
                        </Col>
                    </Row>
                </div>
            </ThemeProvider>
        </>
    );
}

export default CurrentBookingDetails;