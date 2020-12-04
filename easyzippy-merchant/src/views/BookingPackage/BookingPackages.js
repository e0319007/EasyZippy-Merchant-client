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
 
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});


function BookingPackages() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS

    var columns = [
        {title: "Id", field: 'id'},
        {title: "Booking Package", field:"bookingPackageModelId",
        customFilterAndSearch: (term, rowData) => getBookingPackageName(rowData.bookingPackageModelId).toLowerCase().includes(term.toLowerCase()),
        render: row => <span>{ getBookingPackageName(row["bookingPackageModelId"]) }</span>}, 
        {title: "Kiosk", field:"kioskId",
        customFilterAndSearch: (term, rowData) => getKioskName(rowData.kioskId).toLowerCase().includes(term.toLowerCase()),
        render: row => <span>{ getKioskName(row["kioskId"]) }</span>}, 
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
        {title: "Expired", field:"expired", lookup:{false: "Not Expired", true: "Expired"}}          
    ]

    const [data, setData] = useState([])
    const [kiosks, setKiosks] = useState([])
    const [bookingPackages, setBookingPackages] = useState([])
    

    const merchantId = parseInt(Cookies.get('merchantUser'))
 

    useEffect(() => {
        axios.get(`/merchantBookingPackages/${merchantId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)

        }).catch(function (error) {
        })

        axios.get("/kiosks", 
        {
            headers: {
                AuthToken:authToken
            }
        }).then(res => {
            setKiosks(res.data)
        }).catch(function (error) {
        })

        axios.get("/bookingPackageModels", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setBookingPackages(res.data)
        }).catch(function (error) {
        })
    },[authToken,merchantId])

    //match kiosk id to kiosk name
    function getKioskName(id) {
        for (var i in kiosks) {
            if (kiosks[i].id === id) {
                return kiosks[i].address
            }
        }
    }

    //match booking package id to booking package name 
    function getBookingPackageName(id) {
        for (var i in bookingPackages) {
            if (bookingPackages[i].id === id) {
                return bookingPackages[i].name
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

        return dt + "/" + month + "/" + year + " " + time ;
    }
    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable  
                                title="Booking Packages List"
                                columns={columns}
                                data={data}
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
                                        tooltip: "View Booking Package Details",
                                        onClick: (event, rowData) => {
                                            history.push('/admin/bookingPackageDetails')
                                            localStorage.setItem('bookingPackageToView', JSON.stringify(rowData.id))
                                        }
                                    }
                                ]}
                            />     
                        </Card>
                    </Col>
                </Row>
            </div>   
        </ThemeProvider>     
    )
}


export default BookingPackages;