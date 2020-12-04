import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    CardHeader, FormGroup, Label, Button, Alert
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function PromotionDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

    const promotionId = JSON.parse(localStorage.getItem('promotionToView'))
    const [data, setData] = useState([])
    const [merchants, setMerchants] = useState([])
    const [expireMsg, setExpireMsg] = useState()
    


    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [promoCode, setPromoCode] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [percentageDiscount, setPercentageDiscount] = useState('')
    const [flatDiscount, setFlatDiscount] = useState('')
    const [usageLimit, setUsageLimit] = useState('')
    const [minimumSpend, setMinimumSpend] = useState('')

   
    const merchantId = parseInt(Cookies.get('merchantUser'))
    
    

    useEffect(() => {
        axios.get(`/promotion/${promotionId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)

            setPromoCode(res.data.promoCode)
            setTitle(res.data.title)
            setDescription(res.data.description)
            setTermsAndConditions(res.data.termsAndConditions)
            setStartDate((res.data.startDate).substr(0,10))
            setEndDate((res.data.endDate).substr(0,10))
            setPercentageDiscount(res.data.percentageDiscount)
            setFlatDiscount(res.data.flatDiscount)
            setUsageLimit(res.data.usageLimit)
            setMinimumSpend(res.data.minimumSpend)

            if (res.data.expired) {
                setExpireMsg(" : Expired")
            }
            axios.get("/merchants", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setMerchants(res.data)
               
            }).catch()
        }).catch (function (error) {
        })
    },[authToken,promotionId])

    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }
    const onChangeTermsAndConditions = e => {
        const termsAndConditions = e.target.value
        setTermsAndConditions(termsAndConditions)
    }


    const updatePromotion = e => {
        e.preventDefault()
        var startd = startDate
        startd = startd.toString().replace('/-/g', '/')

        var enddate = endDate
        enddate = enddate.toString().replace('/-/g', '/')


        axios.put(`/promotion/${promotionId}`, {
            promoCode: promoCode,
            title: title,
            description: description, 
            termsAndConditions: termsAndConditions,
            startDate: startd,
            endDate: enddate,
            percentageDiscount: percentageDiscount,
            flatDiscount: flatDiscount,
            usageLimit: usageLimit,
            minimumSpend: minimumSpend,
            merchantId: merchantId
        }, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
     
            setPromoCode(res.data[1][0].promoCode)
            setTitle(res.data[1][0].title)
            setDescription(res.data[1][0].description)
            setTermsAndConditions(res.data[1][0].termsAndConditions)
            setStartDate((res.data[1][0].startDate).substr(0,10))
            setEndDate((res.data[1][0].endDate).substr(0,10))
            setPercentageDiscount(res.data[1][0].percentageDiscount)
            setFlatDiscount(res.data[1][0].flatDiscount)
            setUsageLimit(res.data[1][0].usageLimit)
            setMinimumSpend(res.data[1][0].minimumSpend)
            

            isError(false)
            isSuccessful(true)
            setMsg("Promotion successfully updated!")
        }).catch(function (error) {
            isSuccessful(false)
            isError(true)
            setError(error)
        })
    }

    //match staff id to staff name
    function getMerchantName(id) {
        for (var i in merchants) {
            if (merchants[i].id === id) {
                return merchants[i].name
            }
        }
    }

    // to use when viewing 
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

        return dt + "/" + month + "/" + year + " " + time;
        
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
                                    <CardTitle className="col-md-10" tag="h5">Promotion Details (ID: {data.id}) {expireMsg}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled>    
                                            <FormGroup>
                                                <Label for="inputName">Merchant Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="-"
                                                    value={getMerchantName(merchantId)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPromoCode">Promo Code</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPromoCode"
                                                    placeholder="-"
                                                    value={promoCode}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTitile">Title</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTitile"
                                                    placeholder="-"
                                                    value={title}
                                                />
                                            </FormGroup>
                                            </fieldset>
                                            <fieldset>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="-"
                                                    value={description}
                                                    onChange={onChangeDescription}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTermsAndConditions">Terms and Conditions</Label>
                                                <Input
                                                    type="textarea"
                                                    id="inputTermsAndConditions"
                                                    placeholder="-"
                                                    value={termsAndConditions}
                                                    onChange={onChangeTermsAndConditions}
                                                />
                                            </FormGroup>
                                            </fieldset>
                                            <fieldset disabled>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStartDate">Start Date</Label>
                                                    <Input
                                                        type="date"
                                                        id="inputStartDate"
                                                        placeholder="-"
                                                        value={startDate}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEndDate">End Date</Label>
                                                    <Input
                                                        type="date"
                                                        id="inputEndDate"
                                                        placeholder="-"
                                                        value={endDate}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <FormGroup>
                                            <Label for="inputPercentageDiscount">Percentage Discount (%)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPercentageDiscount"
                                                    placeholder="-"
                                                    value={percentageDiscount}                                               
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                            <Label for="inputFlatDiscount">Flat Discount ($)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputFlatDiscount"
                                                    placeholder="-"
                                                    value={flatDiscount}                                               
                                                />
                                            </FormGroup>                                                                            
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputUsageLimit">Usage Limit</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputUsageLimit"
                                                        placeholder="-"
                                                        value={usageLimit}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputMinimumSpend">Minimum Spend ($)</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputMinimumSpend"
                                                        placeholder="-"
                                                        value={parseFloat(minimumSpend).toFixed(2)}
                                                    />
                                                </FormGroup>
                                            </div>
           
                                                <div className="form-row">
                                                    <FormGroup className="col-md-6">
                                                        <Label for="inputCreatedAt">Created On</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputCreatedAt"
                                                            placeholder="-"
                                                            value={formatDate(data.createdAt)}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="col-md-6">
                                                        <Label for="inputExpired">Expired</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputExpired"
                                                            placeholder="-"
                                                            value={data.expired}
                                                        />
                                                    </FormGroup>
                                                </div>
                    
                                                {err &&<Alert color="danger">{error}</Alert> }
                                                {successful &&<Alert color="success">{successMsg}</Alert>}                               
                                            </fieldset>                                                
                                            <Row>
                                                <div className="update ml-auto mr-auto" >
                                                    <Button color="success" size="sm" type="submit" onClick={updatePromotion}>Update Mall Promotion</Button>
                                                </div>
                                            </Row>    
                                            <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/promotions')
                                                        localStorage.removeItem('promotionToView')
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

export default PromotionDetails;