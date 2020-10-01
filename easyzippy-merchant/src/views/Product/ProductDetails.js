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

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

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
    
        let enabled = !data.disabled
        console.log("Enabled: " + enabled)
    
        const handleChange = (event) => {
            console.log("event.target.checked: " + event.target.checked)
            setData({
                ...data,
                disabled: !event.target.checked
            })
            axios.put(`/product/disable/${productId}`, {
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

    return(
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Product Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <div className="text-center" >
                                            <CardImg style={{width:"20rem"}} top src="../../easyzippylogo.jpg" alt="..."/>
                                        </div>
                                        <fieldset>  
                                            <FormGroup>
                                                <Label for="inputId">Id</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="id number here"
                                                    //value={data.id}
                                                    //onChange={}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputName">Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="name here"
                                                    //value={data.name}
                                                    //onChange={}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input 
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="description here"
                                                    //value={data.description}
                                                    //onChange={}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPrice">Price</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputPrice" 
                                                    placeholder="Price" 
                                                    //value={data.unitPrice} 
                                                    //onChange={}                                                   
                                                    />
                                            </FormGroup>   
                                            <FormGroup>
                                                <Label for="inputCategory">Category</Label>
                                                <Input 
                                                    type="select" 
                                                    id="inputCategory" 
                                                    placeholder="Category" 
                                                    //value={data.category}  
                                                    //onChange={}                                                  
                                                >
                                                    <option>get list of category</option>
                                                </Input>
                                            </FormGroup>  
                                            <FormGroup>
                                                <Label for="inputQuantityAvailable">Quantity Available</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputQuantityAvailable" 
                                                    placeholder="Quantity Available" 
                                                    //value={data.quantityAvailable}  
                                                    //onChange={}                                                  
                                                    />
                                            </FormGroup>                   
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Typography component="div">
                                                    <Grid component="label" container alignItems="center" spacing={1}>
                                                    <Grid item>Disabled</Grid>
                                                    <Grid item>
                                                        <DisableSwitch checked={!data.disabled} onChange={handleChange} name="checked" />
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
                                                <Button color="primary" size="sm" onClick={()=>{
                                                    history.push('/admin/products')
                                                }}>Return to Products Page</Button>
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
            </ThemeProvider>
        </>
    );
}

export default ProductDetails;