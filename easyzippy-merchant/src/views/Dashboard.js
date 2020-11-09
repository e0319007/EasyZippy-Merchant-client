import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Line } from "react-chartjs-2";
import ReactShadowScroll from 'react-shadow-scroll';


// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  ListGroupItem,
  ListGroup,
  DropdownMenu,
  Dropdown,
  DropdownItem
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
} from "variables/charts.js";

function Dashboard() {

  const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
  
  const merchantId = (JSON.parse(Cookies.get('merchantUser'))).toString()

  const [productsLength, setProductsLength] = useState('')
  const [ordersLength, setOrdersLength] = useState('')
  const [adsLength, setAdsLength] = useState('')
  const [promoLength, setPromoLength] = useState('')
  const [notifications, setNotifications] = useState([])
  const [announcements, setAnnouncements] = useState([])
  


  useEffect(() => {

    //GET PRODUCTS
    axios.get(`/merchantProducts/${merchantId}`, {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      console.log("successfully retrieve products")
      setProductsLength(res.data.length)

      axios.get(`/orders/merchant/${merchantId}`, {
        headers: {
          AuthToken: authToken
        }
      }).then(res => {
        setOrdersLength(res.data.length)
      })

      axios.get(`/advertisement/merchant/${merchantId}`, {
        headers: {
          AuthToken: authToken
        }
      }).then(res => {
        setAdsLength(res.data.length)
      })
    }).catch( function(error) {
      console.log(error.response)
    })

    axios.get(`/promotion/merchant/${merchantId}`, {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setPromoLength(res.data.length)
    })

    axios.get(`/notification/merchant/${merchantId}`, {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setNotifications(res.data)
    })

    axios.get('/announcements', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setAnnouncements(res.data)
    })

  },[])


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
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/><br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-shop text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                  <br/><br/>
                    <div className="numbers">
                      <p className="card-category">Products</p>
                      <CardTitle tag="p">{productsLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/><br/>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <br/><br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-paper text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <br/><br/>
                    <div className="numbers">
                      <p className="card-category">Orders</p>
                      <CardTitle tag="p">{ordersLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/><br/>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <br/><br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-image text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                  <br/><br/>
                    <div className="numbers">
                      <p className="card-category">Advertisements</p>
                      <CardTitle tag="p">{adsLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/><br/>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <br/><br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-tag-content text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                  <br/><br/>
                    <div className="numbers">
                      <p className="card-category">Promotions</p>
                      <CardTitle tag="p">{promoLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/><br/>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col md="6">
          <Card className="card-name" style={{height:"28rem"}}>
              <CardHeader>
                  <div className="form-row">
                      <CardTitle className="col-md-10" tag="h5"><small>Notifications</small></CardTitle>
                  </div>
              </CardHeader>
                <ListGroup flush style={{overflow:"scroll"}}>
                {
                  notifications.map(notification => (
                    <ListGroupItem key={notification.id}>
                      <p style={{fontWeight:'bold', color:'grey'}}>{notification.title}</p>
                      <small style={{color:'grey'}}>{formatDate(notification.sentTime)}</small>
                      <p className="text-muted">{notification.description}</p>

                    </ListGroupItem>
                  )).reverse()
                }
              </ListGroup>
              <CardBody></CardBody>
            </Card>
          </Col>
          <Col md="6">
          <Card className="card-name" style={{height:"28rem"}}>
              <CardHeader>
                  <div className="form-row">
                      <CardTitle className="col-md-10" tag="h5"><small>Announcements</small></CardTitle>
                  </div>
              </CardHeader>
              <ListGroup flush style={{overflow:"scroll"}}>
                {
                    announcements.map(announcement => (
                      <ListGroupItem key={announcement.id}>
                        <p style={{fontWeight:'bold', color:'grey'}}>{announcement.title}</p>
                        <small style={{color:'grey'}}>{formatDate(announcement.sentTime)}</small>
                        <p className="text-muted">{announcement.description}</p>

                      </ListGroupItem>
                    )).reverse()
                  }
              </ListGroup>
              <CardBody></CardBody>
            </Card>
          </Col>    
        </Row>
      </div>
    </>
  )
}

export default Dashboard;
