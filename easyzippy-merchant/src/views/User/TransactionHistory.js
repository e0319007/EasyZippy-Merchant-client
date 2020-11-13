import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import {
    Row,
    Col,
    Card,
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});


function TransactionHistory() {

    const authToken = JSON.parse(Cookies.get('authToken'))
    const merchantId = (JSON.parse(Cookies.get('merchantUser'))).toString()

    // DECLARING COLUMNS

    var merchantColumns = [
        {title: "Id", field: 'id'},
        {title: "Transaction Date", field: "createdAt", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.createdAt).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["createdAt"]) }</span>},
        {title: "Amount", field: "amount", 
            render: row => <span>{ parseFloat(row["amount"]).toFixed(2) }</span>},
        {title: "Credit Payment Type", field:"creditPaymentTypeEnum"},
        {title: "Referral Credit Used", field:"referralCreditUsed"}          
    ]

    const [merchantData, setMerchantData] = useState([])

    useEffect(() => {
        axios.get(`/merchantCreditPaymentRecords/${merchantId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setMerchantData(res.data)

        }).catch(function (error) {
            console.log(error)
        })
    },[])


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
                                title="Transaction List"
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
                            />    
                        </Card>
                    </Col>
                </Row>
            </div>   
        </ThemeProvider>     
    )
}

export default TransactionHistory;