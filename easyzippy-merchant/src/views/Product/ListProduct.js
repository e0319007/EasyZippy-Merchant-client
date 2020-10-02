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
import { resolveSoa } from "dns";

function ListProduct() {
    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))
    console.log("merchant name: " + merchant.name)

    const merchantid = parseInt(Cookies.get('merchantUser'))
    console.log("merchant id: " + merchantid)

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

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
    const [imageName, setImageName] = useState('Choose Image');

    const [categoryId, setCategoryId] = useState('')

    const [categories, setCategories] = useState([])

    let imageArr = []

    useEffect(() => {   
        axios.get('/categories', {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            console.log("successfully retrieve categories")
            console.log(res.data[1])
            setCategories(res.data)
            console.log(categories.length)
        }).catch(err => console.error(err))
    },[])

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
        setUnitPrice(unitPrice.trim())
        if (unitPrice.trim().length === 0) {
            setError("Price is a required field")
            isError(true)
        } else if (unitPrice.indexOf('$') > 0) {
            setError("Please enter the price without a '$' sign")
            isError(true)
        } else {
            isError(false)
        }
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

        console.log("category id: " + id)

        setCategoryId(id)
        setCategory(category)
    }

    const onChangeQuantityAvailable = e => {
        const quantityAvailable = e.target.value;
        setQuantityAvailable(quantityAvailable.trim())
        if (quantityAvailable.trim().length === 0) {
            setError("Quantity available is a required field")
            isError(true)
        } else if (parseInt(quantityAvailable) === 0){
            setError("Quantity Available has to be at least 1")
            isError(true)
        } else {
            //make sure quantity available is a number
            var nums = /^[0-9]+$/
            if (!quantityAvailable.match(nums)) { //if not all numbers
                setError("Please enter a valid quantity")
                isError(true)
            } else {
                isError(false)
            }
        }
    }

    const onChangeImages = e => {
        setImages(e.target.files[0])
        setImageName(e.target.files[0].name)
    }

    const createProduct = e => {
        e.preventDefault()

        console.log("in create product method")

        if (name.length === 0 || unitPrice.length === 0 ||
            quantityAvailable.length === 0) {
                setError("Please fill in all fields")
                isError(true)
                return;
            }

        console.log("image uploading..")
        let formData = new FormData();
        formData.append('images', images)
        console.log('****' + formData.has('images'))

        axios.post(`/product/addImage`, formData,
        {
            headers: {
                AuthToken: authToken
            }
        }).then((res) => {
            console.log("image upload axios call went through")
            // isError(false)
            // isSuccessful(true)
            // setMsg("Image uploaded!")
        
            let arr = []
            console.log("first: " + res.data[0])
            console.log("typeof: " + typeof(res.data[0]))
            console.log("resdatatype: " + (typeof res.data))
            arr.push(res.data[0])
            console.log(arr)
            try{
                imageArr = arr
            } catch(err) {
                console.log("set images err: " + err)
            }
            
            console.log("name: " + name)
            console.log("description: " + description)
            console.log("unit price: " + unitPrice)
            console.log("category id: " + categoryId)
            console.log("quantity available: " + quantityAvailable)
            console.log("images: " + imageArr[0])
            console.log("merchant id: " + merchantid)

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
                console.log("create product axios call went through")
                isError(false)
                isSuccessful(true)
                setMsg("Product successfully listed!")
            }).catch(function(error) {
                isSuccessful(false)
                isError(true)
                setError(error.response.data)
                console.log(error.response.data)
            })


        }).catch(function(error){
            console.log(error.response.data)
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
                                                    className='custom-file-input'
                                                    id='customFile'
                                                    onChange={onChangeImages}
                                                />
                                                <Label className='custom-file-label' htmlFor='customFile'>
                                                    {imageName}
                                                </Label>
                                                {/* <Button color="success" size="sm" onClick={imageUpload}>Upload Images</Button> */}
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
                                            {' '}
                                            <Button color="primary" size="sm" onClick={()=>{
                                                history.push('/admin/products')
                                            }}>Return to Products</Button>
                                        </div>
                                    </Row>
                                    { err &&<Alert color="danger">{error}</Alert> }
                                    { successful &&<Alert color="success">{successMsg}</Alert> }
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