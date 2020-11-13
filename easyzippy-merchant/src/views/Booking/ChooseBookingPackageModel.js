import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardHeader, Label, FormGroup, Input, Button, Alert,
    Breadcrumb, BreadcrumbItem,
    CardText,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

function ChooseBookingPackageModel() {

    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))
    console.log("merchant name: " + merchant.name)

    const merchantid = parseInt(Cookies.get('merchantUser'))
    console.log("merchant id: " + merchantid)

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const today = new Date()

    const kioskId = JSON.parse(localStorage.getItem('buyPackageKioskId'))

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    //store booking package models
    const [data, setData] = useState([])
    const [lockerTypes, setlockerTypes] = useState([])

    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal);

    useEffect(() => {
        axios.get(`/bookingPackageModels/${kioskId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
        }).catch (function(error) {
            console.log(error)
        })

        axios.get(`/lockerType/kiosk/${kioskId}`, {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setlockerTypes(res.data)
        }).catch (function(error) {
            console.log(error)
        })
    }, [])

    const getLockerTypeName = id => {
        let lockerTypeName = ''
        for (var i in lockerTypes) {
            if (lockerTypes[i].id === id) {
                lockerTypeName = lockerTypes[i].name
                break;
            }
        }
        return lockerTypeName
    }

    const buyBookingPackage = (e, id) => {
        e.preventDefault()
        localStorage.removeItem('buyPackageKioskId')
        axios.post(`/merchantBookingPackage`, {
            merchantId: merchantid,
            bookingPackageModelId: id, 
            kioskId: kioskId,
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            history.push('/admin/profile')
        }).catch(function (error) {
            console.log(error)
        })   

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
            <div className="content">
                <div>
                    <Breadcrumb>
                        <BreadcrumbItem onClick={function() {
                            localStorage.removeItem('buyPackageKioskId')
                        }}><a href='/admin/profile'>Profile</a></BreadcrumbItem>
                        <BreadcrumbItem active>Buy Booking Package</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <Row>
                    <Col md = "12">
                        {
                        data.map(model => (
                            <Card body key={model.id}>
                                <Row>
                                    <Col className="col-md-8">
                                        <CardBody className="text-left" >
                                            <CardTitle className="h6">{model.name}</CardTitle>
                                            <CardText><i>{model.description}</i></CardText>
                                            <CardText>
                                                <small>Valid from Time of Payment until {formatDate(new Date(Date.now() + parseInt(model.duration) * 24 * 60 * 60 * 1000))}</small>
                                            </CardText>
                                            <CardText><small>Locker Quota: {model.quota} {getLockerTypeName(model.lockerTypeId)} Locker</small></CardText>
                                        </CardBody>
                                    </Col>
                                    <Col className="col-md-4">
                                        <CardBody className="text-right mt-auto">
                                            <p>&nbsp;</p>
                                            <Button onClick={toggle} style={{...padding(10,10,10,10)}}
                                                disabled={parseFloat(merchant.creditBalance) < parseFloat(model.price)}
                                                >
                                                Buy @ ${model.price}
                                            </Button>
                                            {parseFloat(merchant.creditBalance) < parseFloat(model.price) &&
                                                <p style={{color: 'red'}}><i><small>You do not have enough credits to buy this package. Please go to your profile to top-up.</small></i></p>
                                            }
                                            {parseFloat(merchant.creditBalance) >= parseFloat(model.price) &&
                                                <p><i><small>**payment by credits</small></i></p>
                                            }
                                        </CardBody>                                               
                                    </Col>
                                </Row>
                                <Modal isOpen={modal} toggle={toggle}>
                                    <ModalHeader toggle={toggle}>Confirm to Buy Booking Package?</ModalHeader>
                                        <ModalBody>
                                            Payment will be made in credits.
                                        </ModalBody>
                                    <ModalFooter>
                                        <Button color="info" onClick={(e) => {buyBookingPackage(e, model.id)}}>Confirm</Button>{' '}
                                    </ModalFooter>
                                </Modal>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </div>
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


export default ChooseBookingPackageModel;