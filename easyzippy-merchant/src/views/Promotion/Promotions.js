import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';


import {
    Row,
    Col,
    Card,
    Alert,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    FormGroup,
    ModalFooter,
    Button,
 
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});


function Promotions() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS

    var merchantColumns = [
        {title: "Id", field: 'id'},
        {title: "Promo Code", field: "promoCode"}, 
        {title: "Title", field: "title"},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
        {title: "Expired", field:"expired", lookup:{false: "Not Expired", true: "Expired"}}          
    ]

    const [merchantData, setMerchantData] = useState([])
    
    const [promoCode, setPromoCode] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [discount, setDiscount] = useState('')
    const [usageLimit, setUsageLimit] = useState('')
    const [minimumSpend, setMinimumSpend] = useState('')

    const [isPercentage, setIsPercentage] = useState(true)
    const [isFlat, setIsFlat] = useState(false)

    const merchantId = parseInt(Cookies.get('merchantUser'))
    
    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal, setError(false), isSuccessful(false));

    useEffect(() => {
        axios.get(`/promotion/merchant/${merchantId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setMerchantData(res.data)

        }).catch(function (error) {
        })

    },[authToken, merchantId])

   

    const addMerchantPromotion = e => {
        var startd = startDate
        startd = startd.toString().replace('/-/g', '/')

        var enddate = endDate
        enddate = enddate.toString().replace('/-/g', '/')
    
        isInModal(true)
        isSuccessful(false)

        //add validation
        if (promoCode === undefined || promoCode === "") {
            isError(true)
            setError("Unable to create new promotion. Please fill in the promo code field.")
            return;
        }

        if (startd === undefined || startd === "") {
            isError(true)
            setError("Unable to create new promotion. Please select a start date.")
            return;  
        }

        if (enddate === undefined || enddate === "") {
            isError(true)
            setError("Unable to create new promotion. Please select an end date.")
            return;  
        }

        var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
        if (!discount.match(nums)) { //if not all numbers
            setError("Unable to create new promotion. Please enter a valid discount value.")
            isError(true)
            return;
        } 

        if (!usageLimit.match(nums)) { //if not all numbers
            setError("Unable to create new promotion. Please enter a valid usage limit.")
            isError(true)
            return;
        }

        if (minimumSpend.indexOf('$') > 0) {
            setError("Please enter the minimum spend without a '$'sign")
            isError(true)
        } else {
            if (!minimumSpend.match(nums)) { //if not all numbers
                setError("Please enter a valid minimum spend value")
                isError(true)
            } 
        } 
        let startArray = startDate.split("-") 
        var pastdate = new Date(startArray[0], startArray[1]-1, startArray[2])
        var today = new Date()
        //if start date is before today, dont allow to create
        if (today > pastdate) {
            //invalid = true
            isError(true)
            setError("Unable to create promotion where Start Date is before today")
            isSuccessful(false)
            return;
        }

        var percentageDiscount = null
        var flatDiscount = null

        if (isPercentage) {
            percentageDiscount = discount
        } else if (isFlat) {
            flatDiscount = discount
        }

        axios.post("/promotion/merchant", {
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
            isInModal(true)
            isError(false)
            isSuccessful(true)
            setMsg("Merchant Promotion successfully created!")
            document.location.reload()
        }).catch(function (error) {
            isInModal(true)
            isSuccessful(false)
            isError(true)
            setError(error.response.data)
        })
    }

    const onChangePromoCode = e => {
        const promoCode = e.target.value
        setPromoCode(promoCode.trim())
    }
    const onChangeTitle = e => {
        const title = e.target.value
        setTitle(title)
    }
    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }
    const onChangeTermsAndConditions = e => {
        const termsAndConditions = e.target.value
        setTermsAndConditions(termsAndConditions)
    }
    const onChangeStartDate = e => {
        const startDate = e.target.value
        setStartDate(startDate)
    }
    const onChangeEndDate = e => {
        const endDate = e.target.value
        setEndDate(endDate)
    }

    const onChangeDiscount = e => {
        isInModal(true)
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

    const onChangeUsageLimit = e => {
        isInModal(true)
        const usageLimit = e.target.value

        var nums = /^[0-9]+$/
        if (!usageLimit.match(nums)) { //if not all numbers
            setError("Please enter a valid usage limit")
            isError(true)
        } else {
            isError(false)
        }
    
        setUsageLimit(usageLimit)
    }
    
    const onChangeMinimumSpend = e => {
        isInModal(true)
        const minimumSpend = e.target.value
        if (minimumSpend.indexOf('$') > 0) {
            setError("Please enter the minimum spend without a '$'sign")
            isError(true)
        } else {
            var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
            if (!minimumSpend.match(nums)) { //if not all numbers
                setError("Please enter a valid minimum spend value")
                isError(true)
            } else {
                isError(false)
            }
        } 
        setMinimumSpend(minimumSpend)
    }

    const onChangeRadioPercentage = e => {
        const checked = e.target.checked
        setIsPercentage(checked)
        setIsFlat(!checked)
    }

    const onChangeRadioFlat = e => {
        const checked = e.target.checked
        setIsPercentage(!checked)
        setIsFlat(checked)
    }

    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deletePromotion/"+oldData.id, {
            title: oldData.title
        },
        {
        headers: {
            AuthToken: authToken
        }
    }).then(res => {
            const dataDelete = [...merchantData];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setMerchantData([...dataDelete]);
            isInModal(false)
            isError(false)
            isSuccessful(true)
            setMsg("Promotion successfully deleted!")
            resolve()
        })
        .catch(function (error) {

            let errormsg = error.response.data;

            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
            }
            isInModal(false)
            isSuccessful(false)
            isError(true)
            setError(errormsg)
            resolve()
        })
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

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return dt + "/" + month + "/" + year;
    }
    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable  
                                title="Promotions List"
                                columns={merchantColumns}
                                data={merchantData}
                                options={{
                                    
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1', 
                                        color: '#FFF',
                                        fontWeight: 1000,
                                    },
                                    actionsColumnIndex: -1
                                }}
                                actions={[
                                    {
                                        icon: 'info',
                                        tooltip: "View Merchant Promotion Details",
                                        onClick: (event, rowData) => {
                                            history.push('/admin/promotionDetails')
                                            localStorage.setItem('promotionToView', JSON.stringify(rowData.id))
                                        }
                                    },
                                    {
                                        icon: 'add',
                                        onClick: () => {
                                            toggle()
                                        },
                                        isFreeAction: true,
                                        tooltip: 'Add',
                                    },
                                ]}
                                editable={{
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                        handleRowDelete(oldData, resolve)
                                    })
                                }}
                            />
                            { !inModal && err &&<Alert color="danger">{error}</Alert> }
                            { !inModal && successful &&<Alert color="success">{successMsg}</Alert>}       
                        </Card>
                    </Col>
                </Row>
            </div>   
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Merchant Promotion</ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label for="inputPromoCode">Promo Code</Label>
                            <Input 
                                type="text"
                                id="inputPromoCode"
                                placeholder="Promo Code"
                                value={promoCode}
                                onChange={onChangePromoCode}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputTitle">Title</Label>
                            <Input 
                                type="text"
                                id="inputTitle"
                                placeholder="Title"
                                value={title}
                                onChange={onChangeTitle}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputDescription">Description</Label>
                                <Input 
                                    type="textarea" 
                                    id="inputDescription" 
                                    placeholder="Description"
                                    value={description}
                                    onChange={onChangeDescription}
                                />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputTermsAndConditions">Terms and Conditions</Label>
                                <Input 
                                    type="textarea" 
                                    id="inputTermsAndConditions" 
                                    placeholder="Terms and Conditions"
                                    value={termsAndConditions}
                                    onChange={onChangeTermsAndConditions}
                                />
                        </FormGroup>
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
                        <div className="form-row">
                            <FormGroup className="col-md-6" check>
                                <Label check for="percentageRadio">
                                <Input 
                                    type="radio" 
                                    id="percentageRadio" 
                                    checked={isPercentage}
                                    onChange={onChangeRadioPercentage}
                                    style={{...padding(15,0,0,0)}}
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
                                    style={{...padding(15,0,0,0)}}
                                    />
                                Flat Discount ($)</Label>
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup className="col-md-12">
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
                                        placeholder="Usage Limit"
                                        value={usageLimit}
                                        onChange={onChangeUsageLimit}
                                    />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="inputMinimumSpend">Minimum Spend ($)</Label>
                                    <Input 
                                        type="text" 
                                        id="inputMinimumSpend" 
                                        placeholder="Minimum Spend"
                                        value={minimumSpend}
                                        onChange={onChangeMinimumSpend}
                                    />
                            </FormGroup>
                        </div>
                        { inModal && err &&<Alert color="danger">{error}</Alert> }
                        { inModal && successful &&<Alert color="success">{successMsg}</Alert>} 
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addMerchantPromotion}>Create</Button>{' '}
                </ModalFooter>
            </Modal>
        </ThemeProvider>     
    )
}

function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

export default Promotions;