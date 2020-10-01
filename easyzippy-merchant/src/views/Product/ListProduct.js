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
    CardHeader, Label, FormGroup, Input, Button, Alert
} from "reactstrap";

function ListProduct() {
    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const[name, setName] = useState([])

    const[data, setData] = useState([])

    const createProduct = e => {
        e.preventDefault()
        axios.post("/product", {
            name:name
        }, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res=> {
            console.log("axios call went through")
            isError(false)
            isSuccessful(true)
            setMsg("Category successfully added!")
        }).catch(function(error) {
            isSuccessful(false)
            isError(true)
            setError(error.response.data)
            console.log(error.response.data)
        })
    }

    return(



        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5">List A Product</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <FormGroup>
                                        <Label for="inputName">Product Name</Label>
                                        <Input
                                            type="text" 
                                            id="inputName" 
                                            placeholder="Product Name"
                                            //value={name}
                                            //onChange={onChangeName}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="inputDescription">Product Description</Label>
                                        <Input 
                                            type="textarea" 
                                            id="inputDescription" 
                                            placeholder="Product Description" 
                                            //value={description}
                                            //onChange={onChangeDescription}
                                            />
                                    </FormGroup>
                                    <div className="form-row">
                                        <FormGroup className="col-md-4">
                                            <Label for="inputUnitPrice">Price</Label>
                                            <Input
                                                type="text"
                                                id="inputUnitPrice"
                                                placeholder="Price"
                                                //value={unitPrice}
                                                //onChange={onChangeUnitPrice}
                                                />
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                                            <Label for="inputCategory">Category</Label>
                                            <Input
                                                type="select"
                                                id="inputCategory"
                                                //value={category}
                                                //onChange={onChangeCategory}
                                            >
                                                <option>get list of category</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                                            <Label for="inputQuantityAvailable">Quantity Available</Label>
                                            <Input
                                                type="text"
                                                id="inputQuantityAvailable"
                                                placeholder="Quantity Available"
                                                //value={quantityAvailable}
                                                //onChange={onChangeQuantityAvailable}
                                                />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Choose Product Images</Label>
                                                <div className='custom-file mb-4'>
                                                    <Input
                                                        type='file'
                                                        className='custom-file-input'
                                                        id='customFile'
                                                        //onChange={onChange}
                                                    />
                                                    <Label className='custom-file-label' htmlFor='customFile'>
                                                        {/* {filename} */}
                                                        Choose Image
                                                    </Label>
                                                </div>
                                        </FormGroup>
                                    </div>
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Button color="success" size="sm" type="submit" onClick={createProduct}>List Product</Button>
                                            {' '}
                                            <Button color="primary" size="sm" onClick={()=>{
                                                history.push('/admin/products')
                                            }}>Return to Products</Button>
                                        </div>
                                    </Row>
                                    { !inModal && err &&<Alert color="danger">{error}</Alert> }
                                    { !inModal && successful &&<Alert color="success">{successMsg}</Alert> }
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default ListProduct;