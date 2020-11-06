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
    CardHeader, FormGroup, Label, Button, Alert
} from "reactstrap";
import { Form } from "components/UseForm";
import Orders from "./Orders";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function OrderDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const orderId = JSON.parse(localStorage.getItem('orderToView'))
    console.log("order id: " + orderId)
    const [data, setData] = useState([])
    const [customers, setCustomers] = useState([])
    const [promotions, setPromotions] = useState([])    

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    //const [orderStatusEnum, setOrderStatusEnum] = useState('')
    const [orderStatusEnum, setOrderStatusEnum] = useState(data.orderStatusEnum)
    const [orderStatusesEnum, setOrderStatusesEnum] = useState([])

    useEffect(() => {
        axios.get(`/order/${orderId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data[0])
            setOrderStatusEnum(res.data[0].orderStatusEnum)
            console.log("axios call order")
            console.log("current status: ")
            console.log(res.data[0].orderStatusEnum)
            //console.log(res.data)
            //console.log(res.data[0].customerId)
           

            axios.get("/customers", {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setCustomers(res.data)   
            }).catch(err => console.error(err))

            axios.get("/promotions", {
                headers: {
                    AuthToken: authToken
                }
            }).then (res => {
                setPromotions(res.data)
            }).catch(err => console.error(err))
        }).catch(function (error) {
            console.log(error.response.data)
        })   
        
        axios.get("/order/orderStatus", {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setOrderStatusesEnum(res.data)
            console.log("get all order status enum axios")
            console.log("retrieving order status: " + res.data[2])
        }).catch(err => console.error(err))
    },[])

    const onChangeOrderStatusEnum = e => {
        console.log("in onChangeOrderStatusEnum")
        const orderStatusEnum = e.target.value;
        setOrderStatusEnum(orderStatusEnum)
        console.log("on change: " + orderStatusEnum)
    }

    const updateOrderStatus = e => {
        e.preventDefault()
        axios.put(`/order/${orderId}`, {
            orderStatus: orderStatusEnum
        }, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("update order status axios went through")
            setOrderStatusEnum(res.data[0].orderStatusEnum)
            //setOrderStatusEnum(res.data[0].orderStatusEnum)
            console.log("order status: ")
            console.log(res.data[1][0].orderStatusEnum) 
            setData(res.data[0])
            console.log("res.data: ")
            console.log(res.data[1][0])
            isError(false)
            isSuccessful(true)
            setMsg("Order status updated successfully!")
        }).catch(function(error) {
            console.log(error.response.data)
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }

    //match customer id to customer name
    function getCustomerName(id) {
        console.log("customer id: " + id)
        for (var i in customers) {
            if (customers[i].id === id) {
                return customers[i].firstName + " " + customers[i].lastName
            }
        }
    }

    //match promoIdUsed to promocode 
    function getPromoCode(id) {
        console.log("promo code id: " + id)
        for (var i in promotions) {
            if (promotions[i].id === id) {
                return promotions[i].promoCode
            }
        }
    }

    // to use when viewing 
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
        //return dt + "/" + month + "/" + year;
        
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
                                    <CardTitle className="col-md-10" tag="h5">Order Details (ID: {data.id})</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled> 
                                            <FormGroup>
                                                <Label for="inputName">Customer Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="-"
                                                    value={getCustomerName(data.customerId)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPromoCode">Promotion Code Used (if any)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPromoCode"
                                                    placeholder="-"
                                                    value={getPromoCode(data.promoIdUsed)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTotalAmount">Total Amount ($)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTotalAmount"
                                                    placeholder="-"
                                                    value={data.totalAmount}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputOrderDate">Order Date</Label>
                                                <Input
                                                    type="text"
                                                    id="inputOrderDate"
                                                    placeholder="-"
                                                    value={formatDate(data.orderDate)}
                                                    //value={data.orderDate}
                                                />
                                            </FormGroup>
                                                <FormGroup>
                                                    <Label for="inputCollectionMethod">Collection Method</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputCollectionMethod"
                                                        placeholder="-"
                                                        value={data.collectionMethodEnum}
                                                    />
                                                </FormGroup>
                                            </fieldset>
                                            <fieldset>
                                                <FormGroup>
                                                    <Label for="inputOrderStatus">Order Status</Label>
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="inputOrderStatus"
                                                        value={orderStatusEnum}
                                                        onChange={onChangeOrderStatusEnum}
                                                    >
                                                        {
                                                            orderStatusesEnum.map(orderStatusEnum => (
                                                                <option key={orderStatusEnum.id}>{orderStatusEnum}</option>
                                                            ))
                                                        }
                                                    </Input>
                                                </FormGroup>  
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="success" size="sm" type="submit" onClick={updateOrderStatus}>Update</Button>
                                            </div>
                                        </Row>
                                        {err &&<Alert color="danger">{error}</Alert> }
                                        {successful &&<Alert color="success">{successMsg}</Alert>} 
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/Orders')
                                                        localStorage.removeItem('orderToView')
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

export default OrderDetails;