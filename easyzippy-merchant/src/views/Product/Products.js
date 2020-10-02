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

    //const product = JSON.parse(localStorage.getItem('currentProduct'))

    //const [name, setName] = useState(product.name)

    const product = {
        name: '',
        description: '',
        unitPrice: '',
        category: '',
        quantityAvailable:''
    }

    const[products, setProducts] = useState([])

    const productId = JSON.parse(localStorage.getItem('productToView'))

    useEffect(() => {
        //retrieving all products
        axios.get('/products', {
        headers: {
            AuthToken: authToken
        }
        }).then(res => {
        console.log("successfully retrieve products")
        setProducts(res.data)
        }).catch(err => console.error(err))
    },[])

    const deleteProduct = e => {
        e.preventDefault()
        axios.put(`/product/disable/${productId}`, {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            const allProducts = products.filter(item => item.productId !== productId)
            setProducts(allProducts)
            console.log("axios delete product went through")
        }).catch(function (error) {
            console.log(error.response.data)
        })
    }

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
                                        {
                                            products.map(product => (
                                                <Card style={{width: '22rem', margin:'0.45rem'}} className="text-center" key={product.id} >
                                                    
                                                    <CardImg top src="../../easyzippylogo.jpg"/>
                                                    <CardBody>
                                                        <CardTitle className="h6">{product.name}</CardTitle>
                                                        <CardText>${product.unitPrice}</CardText>
                                                        <CardText>{product.archived}</CardText>
                                                        {/* product details page */}
                                                        <Button color="primary" onClick={() => {
                                                            history.push('/admin/productDetails')
                                                            localStorage.setItem('productToView', JSON.stringify(product.id))
                                                        }}>
                                                            <i className="fa fa-info-circle"/>
                                                        </Button>
                                                        <Button color="danger" onClick={deleteProduct}>
                                                            <i className="fa fa-trash-alt"/>
                                                        </Button>
                                                    </CardBody>
                                                </Card>                                      
                                            ))   
                                        }
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