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

    const productId = JSON.parse(localStorage.getItem('productToView'))

    const [data, setData] = useState([])

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [category, setCategory] = useState('')
    const [quantityAvailable, setQuantityAvailable] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const product_toupdate = {
        name: '',
        description: '',
        unitPrice: '',
        category: '',
        quantityAvailable:''
    }

    const [pdf, setPdf] = useState([])

    const [categories, setCategories] = useState([])

    useEffect(() => {
        console.log("axios use effect")
        axios.get(`/product/${productId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data); 
            
            axios.get(`/assets/${res.data.images}`,{
                responseType: 'arraybuffer'
            }, {
                headers: {
                    AuthToken: authToken,
                    'Content-type': 'application/json'
                }
            }).then(res => {
                var blob = new Blob([res.data], {type: "application/pdf;charset=utf-8"});
                //var blob = new Blob([res.data], {type: "image/png"});
                setPdf(blob)
            }).catch(function(error) {
                console.log(error.response.data)
            })
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

    const onChangeName = e => {
        const name = e.target.value;
        setName(name.trim())
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
    
        let enabled = !data.archived
        console.log("Enabled: " + enabled)
    
        const handleChange = (event) => {
            console.log("event.target.checked: " + event.target.checked)
            setData({
                ...data,
                archived: !event.target.checked
            })
            axios.put(`/product/archive/${productId}`, {
                archived: !event.target.checked
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

        const onChangeCategory = e => {
            const category = e.target.value;
            setCategory(category.trim())
            if (category.trim().length == 0) {
                setError("Category is a required field")
                isError(true)
            } else {
                isError(false)
            }
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
                                            <CardImg style={{width:"20rem"}} top src="../../easyzippylogo.jpg" alt="..."/>
                                        </div>
                                        <fieldset disabled>  
                                            <FormGroup>
                                                <Label for="inputId">Id</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="id number here"
                                                    value={data.id}
                                                    //onChange={}
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
                                                    value={data.name}
                                                    onChange={onChangeName}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input 
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="description here"
                                                    value={data.description}
                                                    //onChange={}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPrice">Price</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputPrice" 
                                                    placeholder="Price" 
                                                    value={data.unitPrice} 
                                                    //onChange={}                                                   
                                                    />
                                            </FormGroup>   
                                            <FormGroup>
                                                <Label for="inputCategory">Category</Label>
                                                <Input 
                                                    type="select" 
                                                    id="inputCategory" 
                                                    placeholder="Category" 
                                                    value={data.category}  
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
                                                    value={data.quantityAvailable}  
                                                    //onChange={}                                                  
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
                                                <Button color="success" size="sm" type="submit" onClick={()=>{}}>Update Product</Button>
                                                {' '}
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