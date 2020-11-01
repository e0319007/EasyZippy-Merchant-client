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
    UncontrolledAlert,
    ModalFooter,
    Button,
    CustomInput,
    InputGroup,
    InputGroupAddon,
    InputGroupText
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
    const [merchants, setMerchants] = useState([])
    
    const [promoCode, setPromoCode] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [percentageDiscount, setPercentageDiscount] = useState('')
    const [flatDiscount, setFlatDiscount] = useState('')
    const [usageLimit, setUsageLimit] = useState('')
    const [minimunSpend, setMinimumSpend] = useState('')

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
            console.log(error.response.data)
        })

        axios.get("/merchants", 
        {
            headers: {
                AuthToken:authToken
            }
        }).then(res => {
            setMerchants(res.data)
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

    const addMerchantPromotion = e => {
        var startd = startDate
        startd = startd.toString().replace('/-/g', '/')
        console.log("start: " + startd)

        var enddate = endDate
        enddate = enddate.toString().replace('/-/g', '/')
     
        //add validation

        // if (promoCode === undefined || promoCode === "") {
        //     isInModal(true)
        //     isError(true)
        //     setError("Unable to create new mall promotion. Please fill in the promo code field.")
        //     isSuccessful(false)
        //     return;
        // }

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
            minimunSpend: minimunSpend,
            merchantId: merchantId
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("create promo axios call went through")
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
            console.log(error.response.data)
        })
    }

    const onChangePromoCode = e => {
        const promoCode = e.target.value
        setPromoCode(promoCode)
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
    const onChangePercentageDiscount = e => {
        const percentageDiscount = e.target.value
        setPercentageDiscount(percentageDiscount)
    }
    const onChangeFlatDiscount = e => {
        const flatDiscount = e.target.value
        setFlatDiscount(flatDiscount)
    }
    // const onChangeDiscount = e => {
    //     const discount = e.target.value

    // }
    const onChangeUsageLimit = e => {
        const usageLimit = e.target.value
        setUsageLimit(usageLimit)
    }
    const onChangeMinimumSpend = e => {
        const minimumSpend = e.target.value
        setMinimumSpend(minimumSpend)
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
            console.log("axios call went through")
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
            console.log(error.response.data)
            resolve()
        })
    }

    // to use when viewing 
    function formatDate(d) {
        //console.log(d)
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();
        //let time = currDate.toLocaleTimeString('en-SG')

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
                            <Label for="inputTitile">Titile</Label>
                            <Input 
                                type="text"
                                id="inputTitile"
                                placeholder="Titile"
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
                        {/* <div>
                            <FormGroup>
                                <CustomInput 
                                    type="radio" 
                                    id="percentageDiscount" 
                                    name="customRadio" 
                                    label="Percentage Discount (%)" />
                                <CustomInput 
                                    type="radio" 
                                    id="flatDiscount" 
                                    name="customRadio" 
                                    label="Flat Discount ($)" />
                            </FormGroup>
                            <Input
                                type="number"                               
                            />
                        </div> */}
                        <div className="form-row">
                            <FormGroup className="col-md-6">
                                <Label for="inputPercentageDiscount">Percentage Discount (%)</Label>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <Input addon 
                                                    type="radio" 
                                                    name="customRadio"
                                                />
                                              </InputGroupText>
                                        </InputGroupAddon>
                                        <Input 
                                            type="number"
                                            placeholder="%" 
                                            onChange={onChangePercentageDiscount}
                                        />
                                            
                                    </InputGroup>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="inputPercentageDiscount">Flat Discount ($)</Label>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <Input addon 
                                                    type="radio" 
                                                    name="customRadio"
                                                />
                                              </InputGroupText>
                                        </InputGroupAddon>
                                        <Input 
                                            type="number"
                                            placeholder="$" 
                                            onChange={onChangeFlatDiscount}
                                        />
                                    </InputGroup>
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup className="col-md-6">
                                <Label for="inputUsageLimit">Usage Limit</Label>
                                    <Input 
                                        type="number" 
                                        id="inputUsageLimit" 
                                        placeholder="Usage Limit"
                                        value={usageLimit}
                                        onChange={onChangeUsageLimit}
                                    />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="inputMinimumSpend">Minimum Spend ($)</Label>
                                    <Input 
                                        type="number" 
                                        id="inputMinimumSpend" 
                                        placeholder="MinimumSpend"
                                        value={minimunSpend}
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
      
                <ModalFooter>
                    
                </ModalFooter>
            
        </ThemeProvider>     
    )
}

export default Promotions;