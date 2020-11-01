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
import { Form } from "components/UseForm";

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
    console.log(authToken)

    const promotionId = JSON.parse(localStorage.getItem('promotionToView'))
    const [data, setData] = useState([])
    const [merchants, setMerchants] = useState([])
    const [expireMsg, setExpireMsg] = useState()
    

    useEffect(() => {
        axios.get(`/promotion/${promotionId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            console.log(res.data)

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
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputPercentageDiscount">Percentage Discount (%)</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputPercentageDiscount"
                                                        placeholder="-"
                                                        value={data.percentageDiscount}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputFlatDiscount">Flat Discount ($)</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputFlatDiscount"
                                                        placeholder="-"
                                                        value={data.flatDiscount}
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