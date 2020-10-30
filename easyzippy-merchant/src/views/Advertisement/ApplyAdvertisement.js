import axios from 'axios';
import React, {useState} from 'react';
import Cookies from 'js-cookie';
import { useHistory, Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import {
    FormGroup,
    Label,
    Input,
    Alert,
    Button,
    Navbar,
    Row,
    Col
} from "reactstrap";

//maybe can add another sweet alert after successful application

function ApplyAdvertisement() {

    const history = useHistory()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [image, setImage] = useState()
    const [imageName, setImageName] = useState('Upload Image')

    const [url, setUrl] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)
    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [alert, setAlert] = useState(false);

    const onChangeTitle = e => {
        var title = e.target.value;
        setTitle(title)
    }

    const onChangeDescription = e => {
        var description = e.target.value;
        setDescription(description)
    }

    const onChangeStartDate = e => {
        const startDate = e.target.value;
        console.log(startDate)
        setStartDate(startDate)
    }

    const onChangeEndDate = e => {
        const endDate = e.target.value;
        console.log(endDate)
        setEndDate(endDate)
    }

    const onChangeUrl = e => {
        const url = e.target.value;
        console.log(url)
        setUrl(url.trim())
    }

    const onChangeMobile = e=> {
        const mobile = e.target.value;
        
        if (mobile.trim().length == 0) {
            setError("Mobile Number is a required field")
            isError(true)
        } else {
            var nums = /^[0-9]+$/
            if (!mobile.match(nums)) { //if not all numbers
                setError("Please enter a valid mobile number")
                isError(true)
            } else {
                isError(false)
            }
        }

        setMobile(mobile.trim())
    }

    const onChangeEmail = e => {
        const email = e.target.value;
        console.log(email)
        setEmail(email.trim())
    }

    const onChangeImage = e => {
        if (e.target.files[0] !== undefined) {
            setImage(e.target.files[0])
            setImageName(e.target.files[0].name)
        }
    }
    
    const hideAlert = () => {
        console.log('Hiding alert...');
        setAlert(false)
    }

    const redirect = () => {
        localStorage.clear()
        history.push('/login')
    }

    const postApply = e => {
        console.log("in post apply function")
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

            if (mobile === undefined || mobile === "") {
                isError(true)
                setError("Unable to apply for new advertisement. Please fill in the mobile field.")
                isSuccessful(false)
                return;
            }

            if (email === undefined || email === "") {
                isError(true)
                setError("Unable to apply for new advertisement. Please fill in the email field.")
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

            axios.post("/createAdvertisementAsMerchantWithoutAccount", {
                title: title,
                description: description,
                image: imgString,
                advertiserUrl: url,
                startDate: startd,
                endDate: enddate,
                advertiserMobile: mobile,
                advertiserEmail: email
            }).then (response => {
                console.log("create ad axios call went through")
                isError(false)
                // isSuccessful(true)
                setAlert(true)
                // setMsg("Advertisement successfully created!")
            }).catch (function (error) {
                let errormsg = error.response.data;
    
                if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                    errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
                }
                isSuccessful(false)
                isError(true)
                setError(errormsg)
                console.log(error.response.data)
            })
        }).catch(function(error){
            let errormsg = error.response.data;
    
            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
            }
            isSuccessful(false)
            console.log(error.response.data)
            isError(true)
            setError(errormsg)
        })
    }

    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <div className="navbar-brand">
                    &nbsp;&nbsp;
                    <img 
                        src={require("../../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span onClick={redirect} style={{fontWeight:"bold", color: 'white', width:'100%', cursor:"pointer"}}>&nbsp;&nbsp;Easy Zippy</span>
                </div>
            </Navbar>
            <form style={{...padding(5, 37, 0, 37)}}>
                <FormGroup>
                    <p className="h6" style={{textAlign: 'center'}}>
                        Apply for Advertisement without an account:
                    </p>
                </FormGroup>
                <div className="form-row">
                    <FormGroup className="col-md-6">
                        <Label for="inputMobile"><small>Mobile Number</small></Label>
                            <Input 
                                type="text" 
                                name="mobile"
                                id="inputMobile" 
                                placeholder="Mobile"
                                value={mobile}
                                onChange={onChangeMobile}
                                style={{...padding(4, 4, 4, 4)}}
                            />
                    </FormGroup>
                    <FormGroup className="col-md-6">
                        <Label for="inputEmail"><small>Email</small></Label>
                            <Input 
                                type="text" 
                                id="inputEmail" 
                                placeholder="Email"
                                value={email}
                                onChange={onChangeEmail}
                                style={{...padding(4, 4, 4, 4)}}
                            />
                    </FormGroup>
                </div>
                <FormGroup>
                    <Label for="inputTitle"><small>Title</small></Label>
                        <Input 
                            type="text" 
                            id="inputTitle" 
                            placeholder="Title"
                            value={title}
                            onChange={onChangeTitle}
                            style={{...padding(4, 4, 4, 4)}}
                        />
                </FormGroup>
                <FormGroup>
                    <Label for="inputDescription"><small>Description</small></Label>
                        <Input 
                            type="textarea" 
                            id="inputDescription" 
                            placeholder="Description"
                            value={description}
                            onChange={onChangeDescription}
                            style={{...padding(4, 4, 4, 4)}}
                        />
                </FormGroup>
                <div className="form-row">
                    <FormGroup className="col-md-6">
                        <Label for="inputStartDate"><small>Start Date</small></Label>
                            <Input 
                                type="date" 
                                id="inputStartDate" 
                                placeholder="Start Date"
                                value={startDate}
                                onChange={onChangeStartDate}
                                style={{...padding(4, 4, 4, 4)}}
                            />
                    </FormGroup>
                    <FormGroup className="col-md-6">
                        <Label for="inputEndDate"><small>End Date</small></Label>
                            <Input 
                                type="date" 
                                id="inputEndDate" 
                                placeholder="End Date"
                                value={endDate}
                                onChange={onChangeEndDate}
                                style={{...padding(4, 4, 4, 4)}}
                            />
                    </FormGroup>
                </div>
                <div className="form-row">
                    <FormGroup className="col-md-6">
                        <Label for="inputUrl"><small>URL (optional)</small></Label>
                            <Input 
                                type="url" 
                                id="inputUrl" 
                                placeholder="url"
                                value={url}
                                onChange={onChangeUrl}
                                style={{...padding(8, 5, 8, 5)}}
                            />
                    </FormGroup>
                    <FormGroup className="col-md-6">
                        <Label><small>Choose Advertisement Image</small></Label>
                            <div className='custom-file mb-4'>
                                <Input
                                    type='file'
                                    className='custom-file-input'
                                    id='customFile'
                                    onChange={onChangeImage}
                                    style={{...padding(4, 4, 4, 4)}}
                                />
                                <Label className='custom-file-label' htmlFor='customFile'>
                                    {imageName}
                                </Label>
                            </div>
                    </FormGroup>
                </div>
                <Row>
                    <div className="update ml-auto mr-auto" >
                        <Button color="primary" type="submit" onClick={postApply}  style={{...padding(6, 15, 6, 15)}}> 
                            Apply
                        </Button>
                    </div>
                </Row>
            </form >
            {alert && 
            <SweetAlert
            success
            title="Your application for an advertisement has been sent!"
            onConfirm={hideAlert}
            >
                Our staff will be in touch to negotiate a price range. 
            </SweetAlert>
            }
            
            {/* <FormGroup> 
                <Link onClick={redirect}>● Click here to return to login page.</Link>
            </FormGroup> */}
            { err &&<Alert color="danger">{error}</Alert> }
            { successful &&<Alert color="success">{successMsg}</Alert>}   
        </div>
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

export default ApplyAdvertisement;