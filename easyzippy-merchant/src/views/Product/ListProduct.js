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

    const merchantid = parseInt(Cookies.get('merchantUser'))

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [category, setCategory] = useState('')
    const [quantityAvailable, setQuantityAvailable] = useState('')
    const [images, setImages] = useState([])
    const [imageName, setImageName] = useState([]);

    const [categoryId, setCategoryId] = useState('')

    const [categories, setCategories] = useState([])

    let imageArr = []

    useEffect(() => {   
        axios.get('/categories', {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
      
            setCategories(res.data)
        }).catch()
    },[authToken])

    const onChangeName = e => {
        const name = e.target.value;
        setName(name)
        if (name.trim().length === 0) {
            setError("Name is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangeDescription = e => {
        const name = e.target.value;
        setDescription(name)
    }

    const onChangeUnitPrice = e => {
        const unitPrice = e.target.value;
        if (unitPrice.trim().length === 0) {
            setError("Price is a required field")
            isError(true)
        } else if (unitPrice.indexOf('$') > 0) {
            setError("Please enter the price without a '$' sign")
            isError(true)
        } else {
            var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
            if (!unitPrice.match(nums)) { //if not all numbers
                setError("Please enter a valid price")
                isError(true)
            } else {
                isError(false)
            }
        } 
        setUnitPrice(unitPrice.trim())
    }

    const onChangeCategory = e => {
        const category = e.target.value;
        let id = '';

        for (var i in categories) {
            let cat = categories[i]
            if (cat.name === category) {
                id = cat.id
                break;
            }
        }


        setCategoryId(id)
        setCategory(category)
    }

    const onChangeQuantityAvailable = e => {
        const quantityAvailable = e.target.value;
        if (quantityAvailable.trim().length === 0) {
            setError("Quantity available is a required field")
            isError(true)
        } else if (parseInt(quantityAvailable) === 0){
            setError("Quantity Available has to be at least 1")
            isError(true)
        } else {
            var nums = /^[0-9]+$/
            if (!quantityAvailable.match(nums)) { //if not all numbers
                setError("Please enter a valid quantity")
                isError(true)
            } else {
                isError(false)
            }
        }
        setQuantityAvailable(quantityAvailable.trim())
    }

    const onChangeImages = e => {
        if (e.target.files[0] !== undefined) {
            setImages(e.target.files)
            let filenames = []
            for (var i in e.target.files) {
                filenames.push(e.target.files[i].name)
            }
            filenames.pop();
            filenames.pop();
            setImageName(filenames)
        }
    }

    const createProduct = e => {
        e.preventDefault()


        if (name.length === 0 || unitPrice.length === 0 ||
            quantityAvailable.length === 0) {
                setError("Please fill in all fields")
                isError(true)
                return;
            }

        let formData = new FormData();
        for (var image in images) {
            formData.append(images[image].name, images[image])
        }

        axios.post(`/product/addImage`, formData,
        {
            headers: {
                AuthToken: authToken
            }
        }).then((res) => {
   
            let arr = []
       
            for (var i in res.data) {
                arr.push(res.data[i])
            }

 
            try{
                imageArr = arr
            } catch(err) {
     
            }
       
     

            //POST PRODUCT
            axios.post("/product", {
                name: name,
                description: description,
                unitPrice: unitPrice,
                categoryId: categoryId, 
                quantityAvailable: quantityAvailable,
                images: imageArr,
                merchantId: merchantid
            }, 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res=> {
                isError(false)
                isSuccessful(true)
                setMsg("Product successfully listed!")
            }).catch(function(error) {
                isSuccessful(false)
                isError(true)
                setError(error.response.data)
            })


        }).catch(function(error){
            isError(true)
            setError(error.response.data)
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
                                            value={name}
                                            onChange={onChangeName}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="inputDescription">Product Description</Label>
                                        <Input 
                                            type="textarea" 
                                            id="inputDescription" 
                                            placeholder="Product Description" 
                                            value={description}
                                            onChange={onChangeDescription}
                                            />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Choose Product Images</Label>
                                            <div className='custom-file mb-4'>
                                                <Input
                                                    type='file'
                                                    multiple
                                                    className='custom-file-input'
                                                    id='customFile'
                                                    onChange={onChangeImages}
                                                />
                                                <Label className='custom-file-label' htmlFor='customFile'>
                                                
                                                {imageName.length + " images uploaded: "}
                                                {
                                                        imageName.map(name => (
                                                            <span key={name}>{name + ", "}</span>
                                                        ))
                                                    }
                                                </Label>
                                            </div>
                                    </FormGroup>
                                    <div className="form-row">
                                        <FormGroup className="col-md-4">
                                            <Label for="inputUnitPrice">Price ($)</Label>
                                            <Input
                                                type="text"
                                                id="inputUnitPrice"
                                                placeholder="Price"
                                                value={unitPrice}
                                                onChange={onChangeUnitPrice}
                                                />
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                                            <Label for="inputCategory">Category</Label>
                                            <Input
                                                type="select"
                                                id="inputCategory"
                                                value={category}
                                                onChange={onChangeCategory}
                                            >
                                                <option>[select]</option>
                                                {
                                                    categories.map(category => (
                                                        <option key={category.id}>{category.name}</option>
                                                    ))
                                                }
                                            </Input>
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                                            <Label for="inputQuantityAvailable">Quantity Available</Label>
                                            <Input
                                                type="text"
                                                id="inputQuantityAvailable"
                                                placeholder="Quantity Available"
                                                value={quantityAvailable}
                                                onChange={onChangeQuantityAvailable}
                                                />
                                        </FormGroup>
                                        
                                    </div>
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Button color="success" size="sm" type="submit" onClick={createProduct}>List Product</Button>
                                        </div>
                                    </Row>
                                    { err &&<Alert color="danger">{error}</Alert> }
                                    { successful &&<Alert color="success">{successMsg}</Alert> }
                                    <Row>
                                        <Col md="12">
                                            <div className="form-add">
                                                <Button onClick={() => {
                                                    history.push('/admin/products')
                                                }}> back
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
        </>
    );
}

export default ListProduct;