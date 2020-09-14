import { Form } from "components/UseForm";
import React from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";

function Profile() {

    const handleSubmit = e => {
        e.preventDefault()
        window.alert("submitted!")
    }

    return(
        <>
            <div className="content">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Edit Profile</CardTitle>
                                    <Button className="btn-round" color="info">Change Password</Button>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <div className="form-row">
                                            <FormGroup className="col-md-6">
                                                <Label for="inputFirstName">First Name</Label>
                                                <Input type="text" id="inputFirstName" defaultValue="Andy" placeholder="First Name"/>
                                            </FormGroup>
                                            <FormGroup className="col-md-6">
                                                <Label for="inputLastName">Last Name</Label>
                                                <Input type="text" id="inputLastName" defaultValue="Wee" placeholder="Last Name"/>
                                            </FormGroup>  
                                        </div>
                                        <FormGroup>
                                            <Label for="inputEmail">Email</Label>
                                            <Input type="email" id="inputEmail" defaultValue="andywee@easyzippy.com" placeholder="Email" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="inputMobile">Mobile Number</Label>
                                            <Input type="text" id="inputMobile" defaultValue="91235678" placeholder="Mobile Number" />
                                        </FormGroup>
                                        <Row>
                                        <div className="update ml-auto mr-auto">
                                            <Button className="btn-round" color="info" type="submit">Update Profile</Button>
                                        </div>
                                        </Row>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
}

export default Profile;