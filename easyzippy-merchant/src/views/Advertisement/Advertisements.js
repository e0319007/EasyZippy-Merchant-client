import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import {MDBCol, MDBIcon} from "mdbreact";
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText,
    Button, 
    CardHeader, 
    CardImg,
    Input,
    FormGroup,
    Label,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "reactstrap";

function Advertisements() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const merchantId = (JSON.parse(Cookies.get('merchantUser'))).toString()

    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const [image, setImage] = useState([])

    //sorting 
    const [lowToHigh, setLowToHigh] = useState(true)

    //for delete confirmation
    const [modal, setModal] = useState(false)
    const toggleModal = id => {
        console.log(id)
        localStorage.setItem('productId', id)
        setModal(!modal);
    }

    let advArr = []
    let tempAdvArr = []

    useEffect(() => {
        //retrieving all ads
        axios.get(`/advertisement/merchant/${merchantId}`, {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            
        })
    })

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardBody>
                                <CardTitle>Advertisements title</CardTitle>
                                <CardText>This is the Advertisements page</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Advertisements;