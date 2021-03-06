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

function AdvertisementDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

    const ad = JSON.parse(localStorage.getItem('advertisementToView'))

    const [data, setData] = useState([])

    const id = ad.id
    
    const amountPaid = ad.amountPaid
    const [title, setTitle] = useState(ad.title)
    const [description, setDescription] = useState(ad.description)
    const [advertiserUrl, setUrl] = useState(ad.advertiserUrl)
    const [startDate, setStartDate] = useState(ad.startDate)
    const [endDate, setEndDate] = useState(ad.endDate)
    const [disabled, setDisabled] = useState(ad.disabled)
    const [image, setImage] = useState(ad.image)

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        axios.get(`/advertisement/${id}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            setDisabled(res.data.disabled)

        }).catch (function(error) {
        })
    }, [authToken,id])


    const handleChange = (event) => {
        setDisabled(!event.target.checked)

        axios.put(`/advertisement/toggleDisable/${ad.id}`, {
            disabled: !event.target.checked
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setMsg("success!")
            isSuccessful(true)
            isError(false)
        }).catch (function(error) {
            setError(error.response.data)
            isError(true)
            isSuccessful(false)
        })
    };

    const onChangeTitle = e => {
        const title = e.target.value 
        setTitle(title)
    }

    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }

    const onChangeUrl = e => {
        const url = e.target.value
        setUrl(url)
    }

    const onChangeStartDate = e => {
        const startDate = e.target.value
        setStartDate(startDate)
    }

    const onChangeEndDate = e => {
        const endDate = e.target.value
        setEndDate(endDate)
    }

    const updateAdvertisement = e => {
        e.preventDefault()

        if (title === undefined || title === "") {
            setError("Unable to update advertisement, please fill in title field")
            isError(true)
            isSuccessful(false)
            return;
        }

        if (description === undefined || description === "") {
            setError("Unable to update advertisement, please fill in description field")
            isError(true)
            isSuccessful(false)
            return;
        }

        if (startDate === undefined || startDate === "") {
            setError("Unable to update advertisement, please fill in start date field")
            isError(true)
            isSuccessful(false)
            return;
        }

        if (endDate === undefined || endDate === "") {
            setError("Unable to update advertisement, please fill in end date field")
            isError(true)
            isSuccessful(false)
            return;
        }

        axios.put(`/advertisement/${ad.id}`, {
            title: title,
            description: description,
            advertiserUrl: advertiserUrl,
            startDate: startDate,
            endDate: endDate,
            amountPaid: amountPaid,
        
        }, 
        {
            headers: {
                AuthToken: authToken,
            }
        }).then (res => {
 
                const newAd = {
                    id: res.data[1][0].id,
                    title: res.data[1][0].title,
                    description: res.data[1][0].description,
                    image: image,
                    advertiserUrl: res.data[1][0].advertiserUrl,
                    startDate: res.data[1][0].startDate.substr(0,10),
                    endDate: res.data[1][0].endDate.substr(0,10),
                    amountPaid: res.data[1][0].amountPaid,
                    approved: res.data[1][0].approved,
                    expired: res.data[1][0].expired
                }
    
                localStorage.setItem('advertisementToView', JSON.stringify(newAd))
                isError(false)
                isSuccessful(true)
                setMsg("Advertisement updated successfully!")
        

            
        }).catch (function(error) {
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

      

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                        <CardTitle className="col-md-10" tag="h5">Advertisement {data.id} Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <div className="text-center">
                                            <CardImg style={{width:"18rem"}} top src={image}  alt="..."/>
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
                                                <Label for="inputTitle">Title</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTitle"
                                                    placeholder="title here"
                                                    value={title}
                                                    onChange={onChangeTitle}
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
                                                <Label for="inputUrl">URL</Label>
                                                <Input 
                                                    type="url" 
                                                    id="inputUrl" 
                                                    placeholder="url" 
                                                    value={advertiserUrl} 
                                                    onChange={onChangeUrl}                                                   
                                                    />
                                            </FormGroup>  
                                        </fieldset>
                                        <fieldset disabled>
                                            <FormGroup>
                                                <Label for="amountPaid">Amount Paid</Label>
                                                <Input 
                                                    type="text" 
                                                    id="amountPaid" 
                                                    placeholder="amount paid" 
                                                    value={amountPaid} 
                                                    readonly                                                 
                                                    />
                                            </FormGroup>  
                                        </fieldset>
                                        <div className="form-row">
                                            <FormGroup className="col-md-6">
                                                <Label for="inputStartDate">Start Date</Label>
                                                    <Input 
                                                        type="date" 
                                                        id="inputStartDate" 
                                                        placeholder="Start Date"
                                                        value={startDate}
                                                        onChange={onChangeStartDate}
                                                    />
                                            </FormGroup>
                                            <FormGroup className="col-md-6">
                                                <Label for="inputEndDate">End Date</Label>
                                                    <Input 
                                                        type="date" 
                                                        id="inputEndDate" 
                                                        placeholder="End Date"
                                                        value={endDate}
                                                        onChange={onChangeEndDate}
                                                    />
                                            </FormGroup>
                                        </div>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="success" size="sm" type="submit" onClick={updateAdvertisement}>Update Advertisement</Button>
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
                                        { err &&<Alert color="danger">{error}</Alert> }
                                        { successful &&<Alert color="success">{successMsg}</Alert> }
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/advertisements')
                                                        localStorage.removeItem('advertisementToView')
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
    )
}

export default AdvertisementDetails;