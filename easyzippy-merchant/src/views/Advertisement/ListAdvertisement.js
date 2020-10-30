import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardHeader, Label, FormGroup, Input, Button, Alert
} from "reactstrap";

function ListAdvertisement() {

    const merchant = JSON.parse(localStorage.getItem('currentMerchant'))
    console.log("merchant name: " + merchant.name)

    const merchantid = parseInt(Cookies.get('merchantUser'))
    console.log("merchant id: " + merchantid)

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [advertiserUrl, setUrl] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [image, setImage] = useState()
    const [imageName, setImageName] = useState('Upload Image')

    const onChangeTitle = e => {
        const title = e.target.value;
        setTitle(title)
        if (title.trim().length === 0) {
            setError("Title is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangeDescription = e => {
        const description = e.target.value;
        setDescription(description)
        if (description.trim().length === 0) {
            setError("Description is a required field")
            isError(true)
        } else {
            isError(false)
        }
    }

    const onChangeUrl = e => {
        const url = e.target.value
        setUrl(url)
    }

    const onChangeStartDate = e => {
        const startDate = e.target.value
        setStartDate(startDate)
    }

    const onChangeEndDate = e => {
        const endDate = e.target.value
        setEndDate(endDate)
    }

    const onChangeImage = e => {
        if (e.target.files[0] !== undefined) {
            setImage(e.target.files[0])
            setImageName(e.target.files[0].name)
        }
    }

    const createAdvertisement = e => {
        console.log("in create ad function")
        e.preventDefault()

        //need to post the image first
        let formData = new FormData();
        formData.append(image.name, image)
        console.log('form data values: ')
        for (var v of formData.values()) {
            console.log(v)
        }

        axios.post("/advertisement/addImage", formData, {

        }).then (res => {

            console.log("image upload axios call went through")
            var imgString = res.data
            console.log("image string: " + imgString)

            var startd = startDate
            startd = startd.toString().replace('/-/g', '/')
            console.log(startd)

            var enddate = endDate
            enddate = enddate.toString().replace('/-/g', '/')
            console.log(enddate)

            if (title === undefined || title === "") {
                isError(true)
                setError("Unable to apply for new advertisement. Please fill in the title field.")
                isSuccessful(false)
                return;
            }

            if (description === undefined || description === "") {
                isError(true)
                setError("Unable to apply for new advertisement. Please fill in the description field.")
                isSuccessful(false)
                return;
            }

            if (startd === undefined || startd === "") {
                isError(true)
                setError("Unable to apply for new advertisement. Please select a Start Date.")
                isSuccessful(false)
                return;
            }

            if (enddate === undefined || enddate === "") {
                isError(true)
                setError("Unable to apply for new advertisement. Please select an End Date.")
                isSuccessful(false)
                return;
            }

            var invalid = false

            let startArray = startDate.split("-") 
            var pastdate = new Date(startArray[0], startArray[1]-1, startArray[2])
            var today = new Date()
            //if start date is before today, dont allow to create
            if (today > pastdate) {
                invalid = true
                isError(true)
                setError("Unable to apply for advertisement where Start Date is before today")
                isSuccessful(false)
                return;
            }

            axios.post("/createAdvertisementAsMerchant", {
                title: title,
                description: description,
                image: imgString,
                advertiserUrl: advertiserUrl,
                startDate: startd,
                endDate: enddate,
                merchantId: merchantid
            }, {
                headers: {
                    AuthToken: authToken
                }
            }).then(response => {
                console.log("create ad axios call went through")
                isError(false)
                isSuccessful(true)
                setMsg("Successfully applied for advertisement! Please wait for staff's approval.")
            }).catch (function (error) {
                let errormsg = error.response.data;
    
                if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                    errormsg = "An unexpected error has occurred. Advertisement Application did not go through."
                }
                isSuccessful(false)
                isError(true)
                setError(errormsg)
                console.log(error.response.data)
            })
        }).catch (function (error) {
            let errormsg = error.response.data;

            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. Advertisement Application did not go through."
            }
            isSuccessful(false)
            isError(true)
            setError(errormsg)
            console.log(error.response.data)
        })

    }

    return (
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5">Apply for Advertisement</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <FormGroup>
                                        <Label for="inputTitle">Title</Label>
                                        <Input
                                            type="text" 
                                            id="inputTitle" 
                                            placeholder="title"
                                            value={title}
                                            onChange={onChangeTitle}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="inputDescription">Description</Label>
                                        <Input 
                                            type="textarea" 
                                            id="inputDescription" 
                                            placeholder="description" 
                                            value={description}
                                            onChange={onChangeDescription}
                                            />
                                    </FormGroup>
                                    <Row>
                                        <FormGroup className="col-md-12">
                                            <Label>Choose Advertisement Image</Label>
                                                <div className='custom-file mb-4'>
                                                    <Input
                                                        type='file'
                                                        className='custom-file-input'
                                                        id='customFile'
                                                        onChange={onChangeImage}
                                                    />
                                                    <Label className='custom-file-label' htmlFor='customFile'>
                                                        {imageName}
                                                    </Label>
                                                </div>
                                        </FormGroup>
                                    </Row>
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
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Button color="success" size="sm" type="submit" onClick={createAdvertisement}>Apply</Button>
                                        </div>
                                    </Row>
                                    { err &&<Alert color="danger">{error}</Alert> }
                                    { successful &&<Alert color="success">{successMsg}</Alert> }
                                    <Row>
                                        <Col md="12">
                                            <div className="form-add">
                                                <Button onClick={() => {
                                                    history.push('/admin/advertisements')
                                                }}> back
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
        </>
    )
}

export default ListAdvertisement;