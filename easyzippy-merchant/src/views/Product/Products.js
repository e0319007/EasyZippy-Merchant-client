import React, { useState, useEffect } from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardHeader, Label, FormGroup, Input, Button, Alert
} from "reactstrap";

function Products() {
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5">List a Product</CardTitle>
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
                                        <FormGroup className="col-md-6">
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
                                        <FormGroup className="col-md-6">
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
                                            <Button color="success" size="sm" type="submit" onClick={()=>{}}>List Product</Button>
                                            {' '}
                                            <Button color="primary" size="sm" onClick={()=>{}}>Return to Products Page</Button>
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

export default Products;