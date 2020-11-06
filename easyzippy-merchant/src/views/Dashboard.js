import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Line } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
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

  },[])

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
                      <i className="nc-icon nc-money-coins text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                  <br/><br/>
                    <div className="numbers">
                      <p className="card-category">Revenue</p>
                      <CardTitle tag="p">-</CardTitle>
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
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Sales Revenue</CardTitle>
              </CardHeader>
              <CardBody>
                <Line
                  //data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Dashboard;
