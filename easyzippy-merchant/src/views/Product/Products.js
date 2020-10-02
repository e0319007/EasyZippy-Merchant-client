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
    CardText,Button, CardHeader, CardImg
} from "reactstrap";

function Products() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)
    const[data, setData] = useState([])

    useEffect(() => {
        console.log("retrieving products // axios")
        axios.get("/products", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            // console.log(res.data)
            setData(res.data)
        })
        .catch (err => console.error(err))
    },[])

    

    return(
        
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Products</CardTitle>
                                    <Button color="info" onClick={() => {
                                        history.push('/admin/listProduct')
                                    }}> <i className="nc-icon nc-simple-add"/> {''}
                                        List a Product
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="form-row">

                                    {/* 1st card. use map function to render cards*/}
                                    <Card style={{width: '22rem'}} className="text-center">
                                        <CardImg top src="../../easyzippylogo.jpg" alt="..."/>
                                        <CardBody>
                                            <CardTitle className="h6">Product Name</CardTitle>
                                            <CardText>$10</CardText>
                                            <div className="update ml-auto mr-auto" >

                                            {/* product details page */}
                                            <Button color="primary" onClick={() => {
                                                history.push('/admin/productDetails')
                                            }}>
                                                <i className="fa fa-info-circle"/>
                                            </Button>
                                            </div>
                                        </CardBody>
                                    </Card> 
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    {/* 2nd card */}
                                    <Card style={{width: '22rem'}} className="text-center">
                                        <CardImg top src="../../easyzippylogo.jpg" alt="..."/>
                                        <CardBody>
                                            <CardTitle className="h6">Product Name</CardTitle>
                                            <CardText>$10</CardText>
                                            <div className="update ml-auto mr-auto" >

                                            {/* product details page */}
                                            <Button color="primary" onClick={() => {
                                                history.push('/admin/productDetails')
                                            }}>
                                                <i className="fa fa-info-circle"/>
                                            </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    {/* 3rd card */}
                                    <Card style={{width: '22rem'}} className="text-center">
                                        <CardImg top src="../../easyzippylogo.jpg" alt="..."/>
                                        <CardBody>
                                            <CardTitle className="h6">Product Name</CardTitle>
                                            <CardText>$10</CardText>
                                            <div className="update ml-auto mr-auto" >

                                            {/* product details page */}
                                            <Button color="primary" onClick={() => {
                                                history.push('/admin/productDetails')
                                            }}>
                                                <i className="fa fa-info-circle"/>
                                            </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>    
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Products;