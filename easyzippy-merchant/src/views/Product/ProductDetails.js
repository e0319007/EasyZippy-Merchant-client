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

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardHeader, FormGroup, Label, Input, Button, CardImg, Alert
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
    console.log(authToken)

    const product = JSON.parse(localStorage.getItem('productToView'))

    const [data, setData] = useState([])

    const id = product.id
    const image = product.image
    const imageurl = product.imageurl //supposedly alr an array
    const merchantId = product.merchantId
    const [name, setName] = useState(product.name)
    const [description, setDescription] = useState(product.description)
    const [unitPrice, setUnitPrice] = useState(parseInt(product.unitPrice))
    const [category, setCategory] = useState(product.category)
    const [quantityAvailable, setQuantityAvailable] = useState(product.quantityAvailable)
    const [disabled, setDisabled] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [categories, setCategories] = useState([])

    useEffect(() => {
        console.log("axios use effect")
        axios.get(`/product/${product.id}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            setDisabled(res.data.disabled)
        }).catch (function(error) {
            console.log(error.response.data)
        })

        axios.get('/categories', {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("successfully retrieve categories")
            setCategories(res.data)
        }).catch(err => console.error(err))
    },[])

    let enabled = !data.archived
    console.log("Enabled: " + enabled)

    const handleChange = (event) => {
        console.log("event.target.checked: " + event.target.checked)
        setDisabled(!event.target.checked)

        axios.put(`/product/toggleDisable/${product.id}`, {
            disabled: !event.target.checked
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("axios call went through")
        }).catch (function(error) {
            console.log(error.response.data)
        })
    };

    const onChangeName = e => {
        const name = e.target.value;
        setName(name)
    }
    
    const onChangeUnitPrice = e => {
        const unitPrice = e.target.value;
        setUnitPrice(unitPrice)
    }

    const onChangeCategory = e => {
        const category = e.target.value;
        setCategory(category)
        if (category.trim().length == 0) {
            setError("Category is a required field")
            isError(true)
        } else {
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
            console.log("axios call for update product went through")

            for (var i in categories) {
                if (res.data.categoryId === categories[i].id) {
                    setCategory(categories[i].name)
                    break;
                }
            }

            const newProduct = {
                id: res.data.id,
                name: res.data.name,
                unitPrice: res.data.unitPrice,
                image: image,
                imageurl: imageurl,
                categoryId: res.data.categoryId,
                category: category,
                disabled: disabled,
                archived: res.data.archived,
                description: res.data.description,
                quantityAvailable: res.data.quantityAvailable,
                merchantId: res.data.merchantId
            }
            console.log("new product: " + newProduct)

            localStorage.setItem('productToView', JSON.stringify(newProduct))

        }).catch (function(error) {
            console.log(error.response.data)
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
                                    <CardTitle className="col-md-10" tag="h5">Product {data.id} Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <div className="text-center" >
                                            <CardImg style={{width:"20rem"}} top src={image} alt="..."/>
                                        </div>
                                        <fieldset disabled>  
                                            <FormGroup>
                                                <Label for="inputId">Id</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="id number here"
                                                    value={id}
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
                                                            <option>{category.name}</option>
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
                                                    />
                                            </FormGroup>
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Typography component="div">
                                                    <Grid component="label" container alignItems="center" spacing={1}>
                                                    <Grid item>Disabled</Grid>
                                                    <Grid item>
                                                        <DisableSwitch checked={!data.archived} onChange={handleChange} name="checked" />
                                                    </Grid>
                                                    <Grid item>Enabled</Grid>
                                                    </Grid>
                                                </Typography>
                                            </div> 
                                        </Row>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="success" size="sm" type="submit" onClick={updateProduct}>Update Product</Button>
                                                {' '}
                                                <Button color="primary" size="sm" onClick={()=>{
                                                    history.push('/admin/products')
                                                    localStorage.removeItem('productToView')
                                                }}>Return to Products</Button>
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
            </ThemeProvider>
        </>
    );
}

export default ProductDetails;