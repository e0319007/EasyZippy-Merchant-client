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

    //sorting : startdate
    const [lowToHigh, setLowToHigh] = useState(true)
    //enddate
    const [lowToHighEndDate, setLowToHighEndDate] = useState(true)

    //for delete confirmation
    const [modal, setModal] = useState(false)
    const toggleModal = id => {
        console.log(id)
        localStorage.setItem('advertisementId', id)
        setModal(!modal);

        if (modal === true) {
            localStorage.removeItem('advertisementId')
        }
    }

    let advArr = []
    let tempAdvArr = []

    useEffect(() => {
        //retrieving all ads
        axios.get(`/advertisement/merchant/${merchantId}`, {
            id:'id'
        },{
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            advArr = res.data
            for (var i in advArr) {
                let index = i
                console.log(advArr[i])

                axios.get(`/assets/${advArr[i].image}`, {
                    responseType: 'blob'
                }, 
                {
                    headers: {
                        AuthToken: authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(r => {
                    console.log("axios get image through: " + r.data)
                    var file = new File([r.data], {type:"image/png"})
                    let image = URL.createObjectURL(file)

                    var approvedstr = ""
                    if (advArr[index].approved === true) {
                        approvedstr = "Approved"
                    } 

                    var expiredstr = ""
                    if (advArr[index].expiredstr === true) {
                        expiredstr = "Expired"
                    } 

                    const a = {
                        id: advArr[index].id,
                        title: advArr[index].title,
                        description: advArr[index].description,
                        image: image,
                        advertiserUrl: advArr[index].advertiserUrl,
                        startDate: advArr[index].startDate.substr(0,10),
                        endDate: advArr[index].endDate.substr(0,10),
                        approved: advArr[index].approved,
                        amountPaid: advArr[index].amountPaid,
                        expired: advArr[index].expired,
                        disabled: advArr[index].disabled,
                        approvedString: approvedstr,
                        expiredString: expiredstr
                    }

                    tempAdvArr.push(a)

                    //filtering by: title, description, approval status, expiry status
                    const resultTitle = tempAdvArr.filter(a => a.title.toLowerCase().includes(searchTerm));
                    const resultApproved = tempAdvArr.filter(a => a.approvedString.toLowerCase().includes(searchTerm));
                    const resultExpired = tempAdvArr.filter(a => a.expiredString.toLowerCase().includes(searchTerm));
                    let resultArr = [...new Set([...resultTitle, ...resultApproved, ...resultExpired])]

                    //sort by start date
                    if (lowToHigh) {
                        resultArr.sort(function(a, b) {
                            let astartArr = a.startDate.split("-")
                            var astartd = new Date(astartArr[0], astartArr[1]-1, astartArr[2])
                            let bstartArr = b.startDate.split("-")
                            var bstartd = new Date(bstartArr[0], bstartArr[1]-1, bstartArr[2])
                            return astartd - bstartd
                        })
                    } else {
                        resultArr.sort(function(a, b) {
                            let astartArr = a.startDate.split("-")
                            var astartd = new Date(astartArr[0], astartArr[1]-1, astartArr[2])
                            let bstartArr = b.startDate.split("-")
                            var bstartd = new Date(bstartArr[0], bstartArr[1]-1, bstartArr[2])
                            return bstartd - astartd
                        })
                    }

                    //sort by end date
                    if (lowToHighEndDate) {
                        resultArr.sort(function(a, b) {
                            let aendArr = a.endDate.split("-")
                            var aendd = new Date(aendArr[0], aendArr[1]-1, aendArr[2])
                            let bendArr = b.endDate.split("-")
                            var bendd = new Date(bendArr[0], bendArr[1]-1, bendArr[2])
                            return aendd - bendd
                        })
                    } else {
                        resultArr.sort(function(a, b) {
                            let aendArr = a.endDate.split("-")
                            var aendd = new Date(aendArr[0], aendArr[1]-1, aendArr[2])
                            let bendArr = b.endDate.split("-")
                            var bendd = new Date(bendArr[0], bendArr[1]-1, bendArr[2])
                            return bendd - aendd
                        })
                    }

                    setSearchResults(resultArr)
                }).catch (err => console.error(err))
            }
        }).catch (err => console.error(err))
    },[searchTerm, lowToHigh, lowToHighEndDate])

    //pass in advertisement id also
    const deleteAdvertisement = e => {
        e.preventDefault()

        const id = localStorage.getItem('advertisementId')

        axios.put(`/deleteAdvertisement/${id}`, {
            id: id
        },{
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("axios delete ad went through")
            window.location.reload()
        }).catch(function (error) {
            console.log(error.response.data)
        })
    }

    const handleSearchChange = e => {
        setSearchTerm(e.target.value)
    }

    const sortByStartDate = e => {
        let toggle = lowToHigh
        setLowToHigh(!toggle)
    }

    const sortByEndDate = e => {
        let toggle = lowToHighEndDate
        setLowToHighEndDate(!toggle)
    }


    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Advertisements</CardTitle>
                                    <FormGroup className="form-inline mt-4 mb-4 col-md-5">
                                        <MDBIcon icon="search" />
                                        <input 
                                        className="form-control form-control-sm ml-3 w-75" 
                                        type="text" 
                                        placeholder="Search by title, approval, expiry status" 
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        aria-label="Search" />
                                    </FormGroup>    
                                    <FormGroup className="form-inline mt-4 mb-4 col-md-2">
                                    <Label>Sort by Start Date</Label>
                                        <Button className="btn-icon btn-neutral" onClick={sortByStartDate}>
                                        <i className="fas fa-sort" />
                                        </Button>
                                    </FormGroup>
                                    <FormGroup className="form-inline mt-4 mb-4 col-md-2">
                                    <Label>Sort by End Date</Label>
                                        <Button className="btn-icon btn-neutral" onClick={sortByEndDate}>
                                        <i className="fas fa-sort" />
                                        </Button>
                                    </FormGroup>
                                    <FormGroup className="form-inline mt-4 mb-4 col-md-3">
                                        <div style={{float: "right"}}>
                                            <Button color="info" size="sm" onClick={() => {
                                                    history.push('/admin/listAdvertisement')
                                                }}> <i className="nc-icon nc-simple-add"/> {''}
                                                    Apply for Advertisement
                                            </Button>
                                        </div>
                                    </FormGroup>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="form-row">
                                    {
                                        searchResults.map(adv => (
                                            <Card style={{width: '22rem', margin:'0.45rem'}} className="text-center" key={adv.id} >
                                                <CardImg style={{height:'25rem'}} top src={adv.image}/>
                                                <CardBody>
                                                    <CardTitle className="h6">{adv.title}</CardTitle>
                                                    <CardText><i>{adv.startDate}</i> &nbsp; to &nbsp;<i>{adv.endDate}</i></CardText>
                                                    <CardText>Approved: {adv.approved.toString()}</CardText>
                                                    <CardText>Expired: {adv.expired.toString()}</CardText>
                                                    <Button color="primary" onClick={() => {
                                                            history.push('/admin/advertisementDetails')
                                                            localStorage.setItem('advertisementToView', JSON.stringify(adv))
                                                        }}>
                                                        <i className="fa fa-info-circle"/>
                                                    </Button>
                                                    <Button color="danger" onClick={() => {toggleModal(adv.id)}}>
                                                        <i className="fa fa-trash-alt"/>
                                                    </Button>
                                                </CardBody>
                                            </Card>
                                        ))
                                    }
                                </div>
                            </CardBody>
                        </Card>
                        <Modal isOpen={modal} toggle={toggleModal}>
                            <ModalHeader toggle={toggleModal}>Are you sure you want to delete this advertisement?</ModalHeader>
                            <ModalFooter>
                                <Button color="danger" onClick={deleteAdvertisement}>Delete</Button>
                                <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Advertisements;