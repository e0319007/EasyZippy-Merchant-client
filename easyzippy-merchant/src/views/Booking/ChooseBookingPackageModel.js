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
    Breadcrumb, BreadcrumbItem
} from "reactstrap";

function ChooseBookingPackageModel() {

    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))
    console.log("merchant name: " + merchant.name)

    const merchantid = parseInt(Cookies.get('merchantUser'))
    console.log("merchant id: " + merchantid)

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const kioskId = JSON.parse(localStorage.getItem('buyPackageKioskId'))

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    //store booking package models
    const [data, setData] = useState()

    useEffect(() => {
        axios.get(`/bookingPackageModels/${kioskId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
        }).catch (function(error) {
            console.log(error.response.data)
        })
    }, [])

    return (
        <>
            <div className="content">
                <div>
                    <Breadcrumb>
                        <BreadcrumbItem><a href='/admin/profile'>Profile</a></BreadcrumbItem>
                        <BreadcrumbItem active>Buy Booking Package</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <Row>
                    <Col md = "12">
                        <Card className="card-name">
                            <CardBody>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )

}

export default ChooseBookingPackageModel;