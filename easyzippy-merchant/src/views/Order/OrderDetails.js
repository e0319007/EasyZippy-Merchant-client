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
    CardHeader, FormGroup, Label, Button, Alert, Table
} from "reactstrap";


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

    const [order, setOrder] = useState([])
    const [items, setItems] = useState([])

    const [customers, setCustomers] = useState([])
    const [promotions, setPromotions] = useState([])

    const [orderStatusEnum, setOrderStatusEnum] = useState(order.orderStatusEnum)
    const [orderStatusesEnum, setOrderStatusesEnum] = useState([])

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')


    useEffect(() => {
        axios.get(`/order/${orderId}`,
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setOrder(res.data.order)
            setOrderStatusEnum(res.data.order.orderStatusEnum)
            setItems(res.data.items)

            // console.log("items: ")
            // console.log(res.data.items)
            // console.log("order status: ")
            // console.log(res.data.order.orderStatusEnum)
            // console.log("data: ")
            // console.log(res.data)
            // console.log(res.data.order)
            // console.log("id: ")
            // console.log(res.data.order.id)
        }).catch(err => console.error(err))

        axios.get("/order/orderStatus", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setOrderStatusesEnum(res.data)
            console.log("axios get all order status: ")
            console.log(res.data)
        }).catch(err => console.log(err))

        axios.get("/customers", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setCustomers(res.data)
        }).catch(err => console.log(err))

        axios.get("/promotions",
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setPromotions(res.data)
        }).catch(err => console.log(err))
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
            setOrderStatusEnum(res.data.orderStatusEnum)
            setOrder(res.data)
            isError(false)
            isSuccessful(true)
            setMsg("Order status updated successfully!")
        }).catch(function(error) {
            console.log(error)
            isError(true)
            setError(error)
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
                                    <CardTitle className="col-md-10" tag="h5">Order Details (ID: {order.id})</CardTitle>
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
                                                    value={getCustomerName(order.customerId)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPromoCode">Promotion Code Used (if any)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPromoCode"
                                                    placeholder="-"
                                                    value={getPromoCode(order.promoIdUsed)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTotalAmount">Total Amount ($)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTotalAmount"
                                                    placeholder="-"
                                                    value={order.totalAmount}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputOrderDate">Order Date</Label>
                                                <Input
                                                    type="text"
                                                    id="inputOrderDate"
                                                    placeholder="-"
                                                    value={formatDate(order.orderDate)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputCollectionMethod">Collection Method</Label>
                                                <Input
                                                    type="text"
                                                    id="inputCollectionMethod"
                                                    placeholder="-"
                                                    value={order.collectionMethodEnum}
                                                />
                                            </FormGroup>
                                        </fieldset>
                                        <Table hover responsive>
                                            <thead>
                                                <th>Product Name</th>
                                                <th>Price ($)</th>
                                                <th>Quantity</th>
                                            </thead>
                                            <tbody>
                                                {items.length > 0 && items.map((item,i) => (
                                                    // item.product ? console.log(item.product.name) : console.log(item.productVariation.name)
                                                    <tr>      
                                                        <td>{item.product ? item.product.name : item.productVariation.name}</td>
                                                        <td>{item.product ? item.product.unitPrice : item.productVariation.unitPrice}</td>
                                                        <td>{item.quantity}</td>
                                                    </tr>
                                                ))}         
                                            </tbody>
                                        </Table>
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
                                                        {/* {
                                                            orderStatusesEnum.map(orderStatusEnum => (
                                                                <option key={orderStatusEnum.id}>{orderStatusEnum}</option>
                                                            ))
                                                        } */}
                                                        <option>Processing</option>
                                                        <option>Ready For Collection</option>
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