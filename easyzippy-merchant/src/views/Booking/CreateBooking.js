import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Boxes from '../../assets/img/boxes.png';
import ChooseKiosk from '../../assets/img/chooseKiosk.png';
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
    BreadcrumbItem
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

    const [page, setPage] = useState(1)

    const [kiosks, setKiosks] = useState([])
    const [kiosk, setKiosk] = useState('')
    const [kioskId, setKioskId] = useState('')
    const [lockerTypes, setLockerTypes] = useState([])

    const [bookingPackage, setBookingPackage] = useState(null)

    //booking source enum is 'web'

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
        }).catch (function(error) {
            console.log(error)
        })

    }, [kioskId])

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

    const changePageTwo = e => {
        setPage(2)
    }

    const changePageThree = e => {
        setPage(3)
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
                                : <BreadcrumbItem>Steps 1 & 2</BreadcrumbItem>
                            } 
                            {page === 2
                                ? <BreadcrumbItem active>Step 3</BreadcrumbItem>
                                : <BreadcrumbItem>Step 3</BreadcrumbItem>
                            }
                            {page === 3
                                ? <BreadcrumbItem active>Step 4</BreadcrumbItem>
                                : <BreadcrumbItem >Step 4</BreadcrumbItem>
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
                                                        <Button className="btn-link" color="primary" onClick={changePageTwo}>{lockerType.name}</Button>
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