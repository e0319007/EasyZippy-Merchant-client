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
    CardText,Button, CardHeader
} from "reactstrap";

function Products() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Products List</CardTitle>
                                    <Button color="info" onClick={() => {
                                        history.push('/admin/listProduct')
                                    }}> <i className="nc-icon nc-plus"/>
                                        List a Product
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
            
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Products;