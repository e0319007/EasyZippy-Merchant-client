import axios from 'axios';
import React, {useState} from 'react';
import Cookies from 'js-cookie';
import { useHistory, Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import {
    Form,
    FormGroup,
    Label,
    Input,
    Navbar,
    Row,
    Col,
    Alert
} from "reactstrap";

function FileUpload() {

    const history = useHistory()
    const merchantid = parseInt(Cookies.get('merchantUser'))
    
    const [error, setError] = useState('')
    const [err, isError] = useState(false)
    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');

    const [alert, setAlert] = useState(false);

    // FILE UPLOAD
    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };
    
    const fileUpload = e => {

        console.log("in file upload method")
        console.log("filename: " + filename)
        console.log("file: " + file)

        e.preventDefault()
        let formData = new FormData();

        formData.append('file', file);
        console.log('****' +formData.has('file'))

        axios.post(`/merchant/${merchantid}/uploadTenancyAgreement`, formData,
        ).then(() => {
            console.log("file upload axios call went through")
            isError(false)
            isSuccessful(true)
            setMsg("File uploaded!")
            setAlert(true)
            Cookies.remove('merchantUser')
        }).catch(function(error){
            isError(true)
            setError(error.response.data)
        })
    }

    const hideAlert = () => {
        console.log('Hiding alert...');
        setAlert(false)
    }

    const redirect = () => {
        Cookies.remove('authToken')
        Cookies.remove('merchantUser')
        localStorage.clear()
        history.push('/login')
    }

    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <div className="navbar-brand">
                    &nbsp;&nbsp;
                    <img 
                        src={require("../../../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span style={{fontWeight:"bold", color: 'white', width:'100%'}}>&nbsp;&nbsp;Easy Zippy</span>
                </div>
            </Navbar>
            <Form onSubmit={fileUpload} style={{...padding(30, 87, 0, 87)}}>
                <FormGroup style={{...padding(0, 0, 20, 0)}}>
                    <p className="h5" style={{textAlign: 'center'}}>
                        Upload your Tenancy Agreement
                    </p>
                </FormGroup>
                <div className='custom-file mb-4'>
                    <Input
                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={onChange}
                    />
                    <Label className='custom-file-label' htmlFor='customFile'>
                        {filename}
                    </Label>
                </div>

                <input
                type='submit'
                value='Upload'
                className='btn btn-primary btn-block mt-4'
                />

                {alert && 
                <SweetAlert
                success
                title="Your tenancy agreement has been uploaded!"
                onConfirm={hideAlert}
                >
                    An email will be sent to you when your account has been approved.
                </SweetAlert>
                }
                
                <FormGroup> 
                    <Link onClick={redirect}>● Click here to return to login page.</Link>
                </FormGroup>
                { err &&<Alert color="danger">{error}</Alert> }
            </Form>
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

export default FileUpload