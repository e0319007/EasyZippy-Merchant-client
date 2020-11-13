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

function Bookings() {
    const authToken = JSON.parse(Cookies.get('authToken'))
    const history = useHistory()
    const merchantId = parseInt(Cookies.get('merchantUser'))

    // DECLARING COLUMNS
    var currentBookingsColumns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Locker Type", field: "lockerTypeId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{getLockerType(row["lockerTypeId"])}</span>},    
        {title: "Price", field: "bookingPrice"},
        {title: "Booking Source", field: "bookingSourceEnum", lookup:{Mobile: "Mobile", Kiosk: "Kiosk", Web: "Web"}},
        {title: "Status", field: "bookingStatusEnum", lookup:{Unfulfilled: "Unfulfilled", Fulfilled: "Fulfilled", Active: "Active", Cancelled: "Cancelled"}},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
    ]

    var allBookingsColumns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Locker Type", field: "lockerTypeId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{getLockerType(row["lockerTypeId"])}</span>},    
        {title: "Price", field: "bookingPrice"},
        {title: "Booking Source", field: "bookingSourceEnum", lookup:{Mobile: "Mobile", Kiosk: "Kiosk", Web: "Web"}},
        {title: "Status", field: "bookingStatusEnum", lookup:{Unfulfilled: "Unfulfilled", Fulfilled: "Fulfilled", Active: "Active", Cancelled: "Cancelled"}},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
    ]

    const [viewCurrent, setViewCurrent] = useState(true)
    const [currentBookingsData, setCurrentBookingsData] = useState([])
    const [ongoingBookingsData, setOngoingBookingsData] = useState([])
    const [upcomingBookingsData, setUpcomingBookingsData] = useState([])
    const [allBookingsData, setAllBookingsData] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    useEffect(() => {
        axios.get(`/merchantBooking/${merchantId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setAllBookingsData(res.data)
            console.log("all bookings")
            console.log(res.data)
        }).catch(err => console.error(err))

        axios.get(`/merchantBooking/upcoming/${merchantId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res1 => {
            setUpcomingBookingsData(res1.data)
            console.log("upcoming")
            console.log(res1.data)

            axios.get(`/merchantBooking/ongoing/${merchantId}`, 
                {
                    headers: {
                        AuthToken: authToken
                    }
                }).then(res2 => {
                    setOngoingBookingsData(res2.data)
                    console.log("ongoing")
                    console.log(res2.data)
                    //setCurrentBookingsData(...ongoingBookingsData, ...upcomingBookingsData)
                    //setCurrentBookingsData(ongoingBookingsData.concat(upcomingBookingsData))
                    setCurrentBookingsData(res1.data.concat(res2.data))
                    console.log("current")
                    //console.log(ongoingBookingsData.concat(upcomingBookingsData))
                    console.log(res1.data.concat(res2.data))
                    
                }).catch(err => console.error(err))
            })
                    
        axios.get("/lockerTypes", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setLockerTypes(res.data)
        }).catch(err => console.error(err))

    },[])

    //match lockertype id to locker type name
    function getLockerType(id) {
        for (var i in lockerTypes) {
            if (lockerTypes[i].id === id) {
                return lockerTypes[i].name
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

        return dt + "/" + month + "/" + year + " " + time ;
    }

    return(
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                        { viewCurrent &&
                            <MaterialTable
                                title="Current Bookings List"
                                columns={currentBookingsColumns}
                                data={currentBookingsData}
                                options={{
                                    search: false,
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
                                    tooltip: "View Booking Details",
                                    onClick: (event, rowData) => {
                                        history.push('/admin/currentBookingDetails')
                                        localStorage.setItem('qrCode', JSON.stringify(rowData.qrCode))
                                        localStorage.setItem('bookingToView', JSON.stringify(rowData.id))
                                    }
                                },
                                {
                                    icon: 'sort',
                                    onClick: () => {
                                        setViewCurrent(false)
                                    },
                                    isFreeAction: true,
                                    tooltip: 'Click to view all bookings'
                                }
                            ]}
                            />
                            }
                            {!viewCurrent && 
                                <MaterialTable
                                title="All Bookings List"
                                columns={allBookingsColumns}
                                data={allBookingsData}
                                options={{
                                    search: false,
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
                                    tooltip: "View Booking Details",
                                    onClick: (event, rowData) => {
                                        history.push('/admin/allBookingDetails')
                                        localStorage.setItem('bookingToView', JSON.stringify(rowData.id))
                                    }
                                },
                                {
                                    icon: 'sort',
                                    onClick: () => {
                                        setViewCurrent(true)
                                    },
                                    isFreeAction: true,
                                    tooltip: 'Click to view current bookings'
                                }
                            ]}
                            />             
                            }
                   
                        </Card>
                    </Col>
                </Row>
            </div>
        </ThemeProvider>
    );
}

export default Bookings;