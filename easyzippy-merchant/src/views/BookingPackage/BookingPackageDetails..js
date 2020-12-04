import React, { useState, useEffect } from "react";
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
    CardHeader, FormGroup, Label, Button
} from "reactstrap";


const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function BookingPackageDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

    const bookingPackageId = JSON.parse(localStorage.getItem('bookingPackageToView'))
    const [data, setData] = useState([])
    const [kiosks, setKiosks] = useState([])
    const [bookingPackages, setBookingPackages] = useState([])
    const [expireMsg, setExpireMsg] = useState()
    

    useEffect(() => {
        axios.get(`/bookingPackage/${bookingPackageId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)

            if (res.data.expired) {
                setExpireMsg(" : Expired")
            }

            axios.get("/kiosks", {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setKiosks(res.data)       
            }).catch()
        }).catch(function (error) {

        })
        
        axios.get("/bookingPackageModels", {
            headers:{
                AuthToken: authToken
            }
        }).then(res => {
            setBookingPackages(res.data)
        }).catch(function (error) {

        })
    },[authToken,bookingPackageId])

    //match kiosk id to kiosk name
    function getKioskName(id) {
        for (var i in kiosks) {
            if (kiosks[i].id === id) {
                return kiosks[i].address
            }
        }
    }

    //match booking package id to booking package name 
    function getBookingPackageName(id) {
        for (var i in bookingPackages) {
            if (bookingPackages[i].id === id) {
                return bookingPackages[i].name
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
                                    <CardTitle className="col-md-10" tag="h5">Booking Package Details (ID: {data.id}) {expireMsg}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled> 
                                            <FormGroup>
                                                <Label for="inputBookingPackage">Booking Package</Label>
                                                <Input
                                                    type="text"
                                                    id="inputBookingPackage"
                                                    placeholder="-"
                                                    value={getBookingPackageName(data.bookingPackageModelId)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputKiosk">Kiosk</Label>
                                                <Input
                                                    type="text"
                                                    id="inputKiosk"
                                                    placeholder="-"
                                                    value={getKioskName(data.kioskId)}
                                                />
                                            </FormGroup>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStartDate">Start Date</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputStartDate"
                                                        placeholder="-"
                                                        value={formatDate(data.startDate)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEndDate">End Date</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputEndDate"
                                                        placeholder="-"
                                                        value={formatDate(data.endDate)}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputCreatedAt">Created On</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputCreatedAt"
                                                        placeholder="-"
                                                        value={formatDate(data.createdAt)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputExpired">Expired</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputExpired"
                                                        placeholder="-"
                                                        value={data.expired}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </fieldset>
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/BookingPackages')
                                                        localStorage.removeItem('bookingPackageToView')
                                                    }}>back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row> 
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </ThemeProvider>
        </>
    );
}

export default BookingPackageDetails;