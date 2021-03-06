import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardHeader, FormGroup, Label, Input, Button, CardImg, Alert, 
    Modal, ModalBody, ModalHeader, ModalFooter, Tooltip
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function ProductDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

    const product = JSON.parse(localStorage.getItem('productToView'))

    const [data, setData] = useState([])
    const [variations, setVariations] = useState([])

    const id = product.id
    const image = product.image 
    const imageurl = product.imageurl 
    const merchantId = product.merchantId
    const [name, setName] = useState(product.name)
    const [description, setDescription] = useState(product.description)
    const [unitPrice, setUnitPrice] = useState(parseFloat(product.unitPrice).toFixed(2))
    const [category, setCategory] = useState(product.category)
    const [quantityAvailable, setQuantityAvailable] = useState(product.quantityAvailable)
    const [disabled, setDisabled] = useState('')
    const [disabledVariation, setDisabledVariation] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [categories, setCategories] = useState([])

    const [imgArr, setImgArr] = useState([])

    //modal to create variation
    const [createModal, setCreateModal] = useState(false)
    const [inModal, setInModal] = useState(false)
    const toggleCreate = () => setCreateModal(!createModal)

    //modal to confirm delete variation
    const [deleteModal, setDeleteModal] = useState(false)
    const toggleDeleteModal = () => setDeleteModal(!deleteModal)

    //modal to view variations
    const [viewVariationsModal, setViewVariationsModal] = useState(false)
    const toggleVarModal = () => setViewVariationsModal(!viewVariationsModal)

    //modal to view variation details
    const [variationDetailsModal, setVariationDetailsModal] = useState(false)
    const [inVarDetailsModal, setInVarDetailsModal] = useState(false)
    const toggleVarDetailsModal = () => {


        var v = ''

        for (var i in variations) {
            v = variations[i]
            if (v.id === variationId) {
                setVarDetailsName(v.name)
                setVarDetailsUnitPrice(v.unitPrice)
                setVarDetailsQty(v.quantityAvailable)
                setVarDetailsDescription(v.description)
                setDisabledVariation(v.disabled)
                break;
            }
        }
        
        if (v.image !== null) {
            axios.get(`/assets/${v.image}`, {
                responseType: 'blob'
            },
            {
                headers: {
                    AuthToken: authToken,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                var file = new File([response.data], {type:"image/png"})
                let image = URL.createObjectURL(file)
                setVarDetailsImage(image)
            }).catch (function (error) {
            })
        }

        if (variationDetailsModal) {
            setError(false)
            setInVarDetailsModal(false)
            isSuccessful(false)
        }

        setVariationDetailsModal(!variationDetailsModal)
    }

    const [variation, setVariation] = useState('')
    const [variationId, setVariationId] = useState('')

    const [varName, setVarName] = useState()
    const [varUnitPrice, setVarUnitPrice] = useState()
    const [varQty, setVarQty] = useState()
    const [varDescription, setVarDescription] = useState()
    const [varImage, setVarImage] = useState(null)
    const [varImageName, setVarImageName] = useState("Upload Image")

    const [varDetailsName, setVarDetailsName] = useState('')
    const [varDetailsUnitPrice, setVarDetailsUnitPrice] = useState('')
    const [varDetailsQty, setVarDetailsQty] = useState('')
    const [varDetailsDescription, setVarDetailsDescription] = useState('')
    const [varDetailsImage, setVarDetailsImage] = useState(null)

    const [tooltipCreate, setTooltipCreate] = useState(false);
    const toggleTooltipCreate = () => setTooltipCreate(!tooltipCreate);

    useEffect(() => {
        axios.get(`/product/${product.id}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            setDisabled(res.data.disabled)

            for (var i in res.data.images) {
                axios.get(`/assets/${res.data.images[i]}`, {
                    responseType: 'blob'
                },
                {
                    headers: {
                        AuthToken: authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    var file = new File([response.data], {type:"image/png"})
                    let image = URL.createObjectURL(file)

                    let obj = {
                        key: i,
                        src: URL.createObjectURL(file),
                        alttext: 'product image',
                        caption: 'Image ' + i,
                    }

                    setImgArr(imgArr => [...imgArr, obj])
                }).catch (function (error) {
                })
            }

        }).catch (function(error) {
        })

        axios.get('/categories', {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setCategories(res.data)
        }).catch()

        axios.get(`/productVariationsIncludingDisabled/${product.id}`, {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setVariations(res.data)
        }).catch ()

    },[authToken,product.id])


    const handleChange = (event) => {
        setDisabled(!event.target.checked)

        axios.put(`/product/toggleDisable/${product.id}`, {
            disabled: !event.target.checked
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
        }).catch (function(error) {
        })
    };

    const handleVariationChange = (event) => {

        setInVarDetailsModal(true)

        let varEnabled = !disabledVariation

        setDisabledVariation(!event.target.checked)

        axios.put(`/productVariations/toggleDisable/${variationId}`, {
            disabled: !event.target.checked
        }, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then( res => {
            setMsg("success!")
            isSuccessful(true)
            isError(false)
            window.location.reload()
        }).catch (function(error) {
            setError(error.response.data)
            isError(true)
            isSuccessful(false)
        })
    };
    

    const onChangeName = e => {
        const name = e.target.value;
        setName(name)
    }
    
    const onChangeUnitPrice = e => {
        const unitPrice = e.target.value;
        setInModal(false)
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
        setCategory(category)
        if (category.trim().length === 0) {
            setInModal(false)
            setError("Category is a required field")
            isError(true)
        } else {
            setInModal(false)
            isError(false)
        }
    }

    const onChangeQuantityAvailable = e => {
        const quantityAvailable = e.target.value;
        setQuantityAvailable(quantityAvailable)
    }

    const onChangeDescription = e => {
        const description = e.target.value;
        setDescription(description)
    }

    const updateProduct = e => {
        e.preventDefault()

        let categoryId = ''

        for (var j in categories) {
            if (categories[j].name === category) {
                categoryId = categories[j].id
            }
        }

        axios.put(`/product/${product.id}`, 
        {
            name: name,
            unitPrice: unitPrice,
            description: description,
            quantityAvailable: quantityAvailable,
            images: imageurl, 
            categoryId: categoryId,
            merchantId: merchantId
        },{
            headers: {
                AuthToken: authToken,
            }
        }).then(res => {
         
            for (var i in categories) {
                if (res.data[1][0].categoryId === categories[i].id) {
                    setCategory(categories[i].name)
                    break;
                }
            }

            const newProduct = {
                id: res.data[1][0].id,
                name: res.data[1][0].name,
                unitPrice: res.data[1][0].unitPrice,
                image: image,
                imageurl: imageurl,
                categoryId: res.data[1][0].categoryId,
                category: category,
                disabled: disabled,
                archived: res.data[1][0].archived,
                description: res.data[1][0].description,
                quantityAvailable: res.data[1][0].quantityAvailable,
                merchantId: res.data[1][0].merchantId
            }

      
            localStorage.setItem('productToView', JSON.stringify(newProduct))
            setInModal(false)
            isError(false)
            isSuccessful(true)
            setMsg("Product updated successfully!")

        }).catch (function(error) {
  
            setInModal(false)
            isError(true)
            isSuccessful(false)
            setError(error.response.data)
        })
    }

    const DisableSwitch = withStyles((theme) => ({
        root: {
            width: 28,
            height: 16,
            padding: 0,
            display: 'flex',
        },
        switchBase: {
            padding: 2,
            color: theme.palette.grey[500],
            '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.success.main,
                borderColor: theme.palette.success.main,
            },
            },
        },
        thumb: {
            width: 12,
            height: 12,
            boxShadow: 'none',
        },
        track: {
            border: `1px solid ${theme.palette.grey[500]}`,
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: theme.palette.common.white,
        },
        checked: {},
        }))(Switch);
    
    function formatDate(d) {
        if (d === undefined){
            d = (new Date()).toISOString()
        }
        let currDate = new Date(d);
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
    }
    

    const createProductVariation = e => {
        e.preventDefault()
        if (varName.length === 0 || varUnitPrice.length === 0 ||
            varQty.length === 0 || varImage === null) {
                setError("Please fill in all fields")
                isError(true)
                return;
            }   
        
        let formData = new FormData();
   
        axios.post("/productVariation/addImage", formData, {
            headers: {
                AuthToken: authToken,
            }
        }).then (res => {
       
            var imgString = res.data
   

            axios.post(`/productVariation`, {
                name: varName, 
                unitPrice: varUnitPrice,
                description: varDescription,
                quantityAvailable: varQty,
                image: imgString,
                productId: id
            }, 
            {
                headers: {
                    AuthToken: authToken,
                }
            }).then(res => {
                setInModal(true)
                isError(false)
                isSuccessful(true)
                setMsg("Product Variation created successfully!")
                window.location.reload()
            }).catch (function (error) {
                setInModal(true)
                isError(true)
                isSuccessful(false)
                setError(error.response.data)
            })

        })
    }

    const onChangeVarName = e => {
        const name = e.target.value;
        setVarName(name)
    }

    const onChangeVarDescription = e => {
        const description = e.target.value;
        setVarDescription(description)
    }

    const onChangeVarUnitPrice = e => {
        const up = e.target.value;
        if (up.trim().length === 0) {
            setInModal(true)
            setError("Price is a required field")
            isError(true)
        } else if (up.indexOf('$') > 0) {
            setInModal(true)
            setError("Please enter the price without a '$' sign")
            isError(true)
        } else {
            var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
            if (!up.match(nums)) { //if not all numbers
                setInModal(true)
                setError("Please enter a valid price")
                isError(true)
            } else {
                setInModal(true)
                isError(false)
            }
        } 
        setVarUnitPrice(up.trim())
    }

    const onChangeVarQuantity = e => {
        const quantityAvailable = e.target.value;
        if (quantityAvailable.trim().length === 0) {
            setInModal(true)
            setError("Quantity available is a required field")
            isError(true)
        } else if (parseInt(quantityAvailable) === 0){
            setInModal(true)
            setError("Quantity Available has to be at least 1")
            isError(true)
        } else {
            //make sure quantity available is a number
            var nums = /^[0-9]+$/
            if (!quantityAvailable.match(nums)) { //if not all numbers
                setInModal(true)
                setError("Please enter a valid quantity")
                isError(true)
            } else {
                setInModal(true)
                isError(false)
            }
        }
        setVarQty(quantityAvailable.trim()) 
    }

    const onChangeVarImage = e => {
        if (e.target.files[0] !== undefined) {
            setVarImage(e.target.files[0])
            setVarImageName(e.target.files[0].name)
        }
    }

    const onChangeVariation = e => {
        const variation = e.target.value;
        let id = '';

        for (var i in variations) {
            let v = variations[i]
            if (v.name === variation) {
                setVariation(v)
                id = v.id
                break;
            }
        }


        setVariationId(id)
        // setVariation(variation)
    }

    const onChangeDetailsName = e => {
        const name = e.target.value
        setVarDetailsName(name)
    }

    const onChangeDetailsDescription = e => {
        const descr = e.target.value
        setVarDetailsDescription(descr)
    }

    const onChangeDetailsPrice = e => {
        const unitPrice = e.target.value
        setInVarDetailsModal(true)
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
        setVarDetailsUnitPrice(unitPrice.trim())
    }

    const onChangeDetailsQty = e => {
        const qty = e.target.value
        setInVarDetailsModal(true)
        if (qty.trim().length === 0) {
            setError("Quantity available is a required field")
            isError(true)
        } else if (parseInt(qty) === 0){
            setError("Quantity Available has to be at least 1")
            isError(true)
        } else {
            //make sure quantity available is a number
            var nums = /^[0-9]+$/
            if (!qty.match(nums)) { //if not all numbers
                setError("Please enter a valid quantity")
                isError(true)
            } else {
                isError(false)
            }
        }
        setVarDetailsQty(qty.trim())
    }

    const updateProductVariation = e => {
        e.preventDefault()

        setInVarDetailsModal(true)

        //validation
        if (varDetailsName === "" || varDetailsName === undefined) {
            setError("Name cannot be empty")
            isError(true)
            isSuccessful(false)
            return;
        }

        if (varDetailsDescription === "" || varDetailsDescription === undefined) {
            setError("Description cannot be empty")
            isError(true)
            isSuccessful(false)
            return;
        }

        axios.put(`/productVariations/${variationId}`, {
            name: varDetailsName,
            description: varDetailsDescription,
            unitPrice: varDetailsUnitPrice,
            quantityAvailable: varDetailsQty
        }, {
            headers: {
                AuthToken: authToken,
            }
        }).then (res => {
            setVarDetailsName(res.data.name)
            setVarDetailsDescription(res.data.description)
            setVarDetailsUnitPrice(res.data.unitPrice)
            setVarDetailsQty(res.data.quantityAvailable)

            setInVarDetailsModal(true)
            setError(false)
            isSuccessful(true)
            setMsg("Product Variation successfully updated!")
        }).catch (function (error) {
            setInVarDetailsModal(true)
            isError(true)
            isSuccessful(false)
            setError(error.response.data)
        })
    }

    const deleteProductVariation = e => {
        e.preventDefault()

        setInVarDetailsModal(true)
        
        axios.put(`/deleteProductVariations/${variationId}`, {
            id:variationId
        },{
            headers: {
                AuthToken: authToken,
            }
        }).then (res => {
            isError(false)
            isSuccessful(true)
            setMsg("Product Variation Deleted Successfully")
            window.location.reload()
        }).catch (function (error) {
            isError(true)
            isSuccessful(false)
            setError(error.response.data)
        })



    }

    return(
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <span>
                                    <CardHeader>
                                        <div className="form-row">
                                            <CardTitle tag="h5">Product {data.id} Details</CardTitle>
                                        </div>
                                    </CardHeader>
                                </span>
                                <CardBody>
                                    <form>
                                        <div className="text-center">
                                            <Card style={{width:"18rem", marginLeft: "auto", marginRight: "auto"}} top="true" >
                                                <Slider dots={true} infinite={true} speed={1000} slidesToScroll={1} arrows={true} slidesToShow={1}  >
                                                    {
                                                            imgArr.map(image => (
                                                                <img key={image.key} src={image.src}/>
                                                            ))
                                                        }
                                                </Slider>
                                            </Card>
                                            {/* <CardImg style={{width:"20rem"}} top src={image} alt="..."/> */}
                                            
                                        </div>
                                        <div className="text-center" style={{alignItems: "center"}}>
                                            {variations.length !== 0 && 
                                                <Button outline color="info" onClick={toggleVarModal}>View Variations</Button>
                                            }         
                                            <Button className="btn-icon btn-round ml-1" color="info" size="sm" id="createVariation" onClick={toggleCreate}>
                                                    <i className="fa fa-plus"/>
                                            </Button>
                                            {' '}
                                            <Tooltip placement="right" isOpen={tooltipCreate} target="createVariation" toggle={toggleTooltipCreate}>
                                                    Create Product Variation
                                            </Tooltip>
                                        </div>
                                        <fieldset disabled>  
                                            <FormGroup>
                                                <Label for="inputId">Id</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="id number here"
                                                    value={id}
                                                    readOnly
                                                />
                                            </FormGroup>
                                        </fieldset>
                                        <fieldset>
                                            <FormGroup>
                                                <Label for="inputName">Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="name here"
                                                    value={name}
                                                    onChange={onChangeName}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input 
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="description here"
                                                    value={description}
                                                    onChange={onChangeDescription}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPrice">Price</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputPrice" 
                                                    placeholder="Price" 
                                                    value={unitPrice} 
                                                    onChange={onChangeUnitPrice}                                                   
                                                    />
                                            </FormGroup>   
                                            <FormGroup>
                                                <Label for="inputCategory">Category</Label>
                                                <Input 
                                                    type="select" 
                                                    id="inputCategory" 
                                                    placeholder="Category" 
                                                    value={category}  
                                                    onChange={onChangeCategory}                                                  
                                                >
                                                    {
                                                        categories.map(category => (
                                                            <option key={category.id}>{category.name}</option>
                                                        ))
                                                    }
                                                </Input>
                                            </FormGroup>  
                                            <FormGroup>
                                                <Label for="inputQuantityAvailable">Quantity Available</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputQuantityAvailable" 
                                                    placeholder="Quantity Available" 
                                                    value={quantityAvailable}  
                                                    onChange={onChangeQuantityAvailable}                                                  
                                                    />
                                            </FormGroup>                   
                                        </fieldset>
                                        <fieldset disabled>
                                            <FormGroup>
                                                <Label for="inputCreatedAt">Created On</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputCreatedAt" 
                                                    placeholder="Created On" 
                                                    value={formatDate(data.createdAt)}    
                                                    readOnly                                              
                                                    />
                                            </FormGroup>
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="success" size="sm" type="submit" onClick={updateProduct}>Update Product</Button>
                                            </div>
                                        </Row>
                                        <Row>
                                            <p></p>
                                        </Row>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Typography component="div">
                                                    <Grid component="label" container alignItems="center" spacing={1}>
                                                    <Grid item>Disabled</Grid>
                                                    <Grid item>
                                                        <DisableSwitch checked={!disabled} onChange={handleChange} name="checked" />
                                                    </Grid>
                                                    <Grid item>Enabled</Grid>
                                                    </Grid>
                                                </Typography>
                                            </div> 
                                        </Row>
                                        { !inModal && err &&<Alert color="danger">{error}</Alert> }
                                        { !inModal && successful &&<Alert color="success">{successMsg}</Alert> }
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/products')
                                                        localStorage.removeItem('productToView')
                                                    }}> back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>
                                <Modal isOpen={createModal} toggle={toggleCreate}>
                                    <ModalHeader toggle={toggleCreate}>Create Product Variation</ModalHeader>
                                    <ModalBody>
                                        <form>
                                            <FormGroup>
                                            <Label for="inputVarName">Variation Name</Label>
                                                <Input
                                                    type="text" 
                                                    id="inputVarName" 
                                                    placeholder="name here"
                                                    value={varName}
                                                    onChange={onChangeVarName}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                            <Label for="inputVarDescription">Variation Description</Label>
                                                <Input
                                                    type="textarea" 
                                                    id="inputVarDescription" 
                                                    placeholder="description here (optional)"
                                                    value={varDescription}
                                                    onChange={onChangeVarDescription}
                                                />
                                            </FormGroup>
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                    <Label for="inputVarUnitPrice">Unit Price</Label>
                                                        <Input
                                                            type="text" 
                                                            id="inputVarUnitPrice" 
                                                            placeholder="unit price here"
                                                            value={varUnitPrice}
                                                            onChange={onChangeVarUnitPrice}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                    <Label for="inputVarQuantity">Quantity Available</Label>
                                                        <Input
                                                            type="text" 
                                                            id="inputVarQuantity" 
                                                            placeholder="quantity available here"
                                                            value={varQty}
                                                            onChange={onChangeVarQuantity}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <FormGroup className="col-md-12">
                                                    <Label>Choose Variation Image</Label>
                                                        <div className='custom-file mb-4'>
                                                            <Input
                                                                type='file'
                                                                className='custom-file-input'
                                                                id='customFile'
                                                                onChange={onChangeVarImage}
                                                            />
                                                            <Label className='custom-file-label' htmlFor='customFile'>
                                                                {varImageName}
                                                            </Label>
                                                        </div>
                                                </FormGroup>
                                            </Row>
                                            { inModal && err &&<Alert color="danger">{error}</Alert> }
                                            { inModal && successful &&<Alert color="success">{successMsg}</Alert>}
                                        </form>
                                    </ModalBody>
                                    <ModalFooter>
                                    <Button color="primary" onClick={createProductVariation}>Create</Button>{' '}
                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={viewVariationsModal} toggle={toggleVarModal}>
                                    <ModalHeader toggle={toggleVarModal}>View Product Variations</ModalHeader>
                                    <ModalBody>
                                        <form>
                                            <FormGroup>
                                                <Label for="inputVarToView">Select Variation</Label>
                                                    <Input
                                                        type="select" 
                                                        id="inputVarToView" 
                                                        value={variation.name}
                                                        onChange={onChangeVariation}
                                                    >
                                                    <option>[select]</option>
                                                    {
                                                        variations.map(variation => (
                                                            <option key={variation.id}>{variation.name}</option>
                                                        ))
                                                    }
                                                    </Input>
                                                </FormGroup>
                                        </form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={toggleVarDetailsModal}>View</Button>{' '}
                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={variationDetailsModal} toggle={toggleVarDetailsModal}>
                                    <ModalHeader toggle={toggleVarDetailsModal}></ModalHeader>
                                    {varDetailsImage !== null && 
                                        <div className="text-center" style={{alignItems: "center"}}>
                                            <CardImg style={{width:"17rem", marginLeft: "auto", marginRight: "auto"}} top src={varDetailsImage} alt="product image"/>
                                        </div>
                                    }
                                    <ModalBody>
                                        <form>
                                            <FormGroup>
                                                <Label for="inputDetailsName">Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputDetailsName"
                                                    placeholder="name here"
                                                    value={varDetailsName}
                                                    onChange={onChangeDetailsName}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDetailsDescription">Description</Label>
                                                <Input 
                                                    type="textarea"
                                                    id="inputDetailsDescription"
                                                    placeholder="description here"
                                                    value={varDetailsDescription}
                                                    onChange={onChangeDetailsDescription}
                                                />
                                            </FormGroup>
                                            <Row>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="inputDetailsPrice">Price</Label>
                                                        <Input 
                                                            type="text" 
                                                            id="inputDetailsPrice" 
                                                            placeholder="Price" 
                                                            value={varDetailsUnitPrice} 
                                                            onChange={onChangeDetailsPrice}                                                   
                                                            />
                                                    </FormGroup> 
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="inputDetailsQty">Quantity Available</Label>
                                                        <Input 
                                                            type="text" 
                                                            id="inputDetailsQty" 
                                                            placeholder="Quantity" 
                                                            value={varDetailsQty} 
                                                            onChange={onChangeDetailsQty}                                                   
                                                            />
                                                    </FormGroup> 
                                                </Col>
                                            </Row>    
                                            <Row>
                                            <p></p>
                                        </Row>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Typography component="div">
                                                    <Grid component="label" container alignItems="center" spacing={1}>
                                                    <Grid item>Disabled</Grid>
                                                    <Grid item>
                                                        <DisableSwitch checked={!disabledVariation} onChange={handleVariationChange} name="checked" />
                                                    </Grid>
                                                    <Grid item>Enabled</Grid>
                                                    </Grid>
                                                </Typography>
                                            </div> 
                                        </Row>
                                            { inVarDetailsModal && err &&<Alert color="danger">{error}</Alert> }
                                            { inVarDetailsModal && successful &&<Alert color="success">{successMsg}</Alert>}                                        
                                        </form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={updateProductVariation}>Update</Button>{' '}
                                        <Button color="danger" onClick={toggleDeleteModal}>Delete</Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                                    <ModalHeader toggle={toggleDeleteModal}>Are you sure you want to delete this Product Variation?</ModalHeader>
                                    <ModalFooter>
                                        <Button color="danger" onClick={deleteProductVariation}>Delete</Button>
                                        <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </ThemeProvider>
        </>
    );
}

export default ProductDetails;