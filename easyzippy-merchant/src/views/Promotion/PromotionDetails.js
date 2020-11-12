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
    CardHeader, FormGroup, Label, Button
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
    //console.log(authToken)

    const promotionId = JSON.parse(localStorage.getItem('promotionToView'))
    const [data, setData] = useState([])
    const [merchants, setMerchants] = useState([])
    const [expireMsg, setExpireMsg] = useState()

    const [percentageDiscount, setPercentageDiscount] = useState('')
    const [flatDiscount, setFlatDiscount] = useState('')
  

    const [promoCode, setPromoCode] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [discount, setDiscount] = useState('')
    const [usageLimit, setUsageLimit] = useState('')
    const [minimumSpend, setMinimumSpend] = useState('')

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [isPercentage, setIsPercentage] = useState(true)
    const [isFlat, setIsFlat] = useState(false)
    

    useEffect(() => {
        axios.get(`/promotion/${promotionId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            console.log(res.data)

            if (percentageDiscount != null) {
                setDiscount(res.data.percentageDiscount)
            } else if (flatDiscount != null) {
                setDiscount(res.data.flatDiscount)
            }
            setPromoCode(res.data.promoCode)
            setTitle(res.data.title)
            setDescription(res.data.description)
            setTermsAndConditions(res.data.termsAndConditions)
            setStartDate((res.data.startDate).substr(0,10))
            setEndDate((res.data.endDate).substr(0,10))
            setPercentageDiscount(res.data.percentageDiscount)
            setFlatDiscount(res.data.flatDiscount)
            setDiscount(res.data.discount)
            setUsageLimit(res.data.usageLimit)
            setMinimumSpend(res.data.minimumSpend)


            if (res.data.expired) {
                setExpireMsg(" : Expired")
            }

            axios.get("/merchants", {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setMerchants(res.data)       
            }).catch(err => console.error(err))
        }).catch(function (error) {
            console.log(error.response.data)
        })     
    },[])

    const updatePromotion = e => {
        e.preventDefault()
        var startd = startDate
        startd = startd.toString().replace('/-/g', '/')
        console.log("start: " + startd)

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
            console.log("precentage discount: ")
            console.log(res.data[1][0].percentageDiscount)
        })
    }

    const onChangeRadioPercentage = e => {
        const checked = e.target.checked
        console.log("percentage checked: " + checked)
        setIsPercentage(checked)
        setIsFlat(!checked)
    }

    const onChangeRadioFlat = e => {
        const checked = e.target.checked
        console.log("flat checked: " + checked)
        setIsPercentage(!checked)
        setIsFlat(checked)
    }
    const onChangeDiscount = e => {
        const discount = e.target.value
        if (discount.trim().length === 0) {
            setError("Discount is a required field")
            isError(true)
        } else if (discount.indexOf('$') > 0 || discount.indexOf('%') > 0) {
            setError("Please enter the discount without a '$' or '%' sign")
            isError(true)
        } else {
            var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
            if (!discount.match(nums)) { //if not all numbers
                setError("Please enter a valid discount value")
                isError(true)
            } else {
                isError(false)
            }
        } 
        setDiscount(discount)
    }

    //match merchant id to merchant name
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
            //console.log(undefined)
        }
        let currDate = new Date(d);
        //console.log("currDate: " + currDate)
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

        //return dt + "/" + month + "/" + year + " " + time ;
        return dt + "/" + month + "/" + year;
        
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
                                                    value={getMerchantName(data.merchantId)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPromoCode">Promo Code</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPromoCode"
                                                    placeholder="-"
                                                    value={data.promoCode}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTitile">Title</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTitile"
                                                    placeholder="-"
                                                    value={data.title}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="-"
                                                    value={data.description}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTermsAndConditions">Terms and Conditions</Label>
                                                <Input
                                                    type="textarea"
                                                    id="inputTermsAndConditions"
                                                    placeholder="-"
                                                    value={data.termsAndConditions}
                                                />
                                            </FormGroup>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStartDate">Start Date</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputStartDate"
                                                        placeholder="-"
                                                        value={formatDate(data.startDate)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEndDate">End Date</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputEndDate"
                                                        placeholder="-"
                                                        value={formatDate(data.endDate)}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                        <div className="form-row">
                                                <FormGroup className="col-md-6" check>
                                                    <Label check for="percentageRadio">
                                                    <Input 
                                                        type="radio" 
                                                        id="percentageRadio" 
                                                        checked={isPercentage}
                                                        onChange={onChangeRadioPercentage}
                                                        //style={{...padding(15,0,0,0)}}
                                                        />
                                                    Percentage Discount (%)</Label>
                                                </FormGroup>
                                                <FormGroup className="col-md-6" check>
                                                    <Label check for="flatRadio">
                                                    <Input 
                                                        type="radio" 
                                                        id="flatRadio" 
                                                        checked={isFlat}
                                                        onChange={onChangeRadioFlat}
                                                        //style={{...padding(15,0,0,0)}}
                                                        />
                                                    Flat Discount ($)</Label>
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                                <FormGroup className="col-md-12">
                                                    <Label for="inputDiscount"></Label>
                                                        <Input 
                                                            type="text" 
                                                            id="inputDiscount" 
                                                            placeholder="Discount"
                                                            value={discount}
                                                            onChange={onChangeDiscount}
                                                        />
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputUsageLimit">Usage Limit</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputUsageLimit"
                                                        placeholder="-"
                                                        value={data.usageLimit}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputMinimumSpend">Minimum Spend</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputMinimumSpend"
                                                        placeholder="-"
                                                        value={data.minimumSpend}
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
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="success" size="sm" type="submit" onClick={updatePromotion}>Update Promotion</Button>
                                            </div>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/Promotions')
                                                        localStorage.removeItem('promotionToView')
                                                    }}>back
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