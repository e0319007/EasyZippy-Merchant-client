import axios from 'axios';
import React, {useState} from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

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

const API_SERVER = "http://localhost:5000/merchant"

function FileUpload() {

    const history = useHistory()
    const merchantid = parseInt(Cookies.get('merchantUser'))
    
    const [error, setError] = useState('')
    const [err, isError] = useState(false)
    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});

    // FILE UPLOAD
    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };
    
    const fileUpload = e => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', file);

        axios.post(`http://localhost:5000/merchant/${merchantid}/uploadTenancyAgreement`, {
            tenancyAgreement: formData
        }).then(() => {
            console.log("file upload axios call went through")
            isError(false)
            isSuccessful(true)
            setMsg("File uploaded!")
            Cookies.remove('merchantUser')
        }).catch(function(error){
            isError(true)
            setError(error.response.data)
        })

    }

    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <div className="navbar-brand">
                    &nbsp;&nbsp;
                    <img 
                        src={require("../easyzippylogo.jpg")}
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
                { err &&<Alert color="danger">{error}</Alert> }
                { successful &&<Alert color="success">{successMsg}</Alert> }
            </Form>
            {uploadedFile ? (
                <div className='row mt-5'>
                <div className='col-md-6 m-auto'>
                    <h3 className='text-center'>{uploadedFile.fileName}</h3>
                    <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                </div>
                </div>
            ) : null}
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