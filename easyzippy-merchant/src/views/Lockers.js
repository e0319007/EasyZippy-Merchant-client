import React from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText,
    Form,
    FormGroup,
    Input,
    Button,
    Table,
    CardHeader
} from "reactstrap";

function Lockers() {
    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-4" tag="h4">Lockers List</CardTitle>
                                <Form inline className="ml-auto, col-md-4">
                                    <FormGroup className={"no-border"}>
                                        <Input type="text" placeholder="Search"/>
                                    </FormGroup>
                                    <Button color="success" icon round>
                                        <i className="nc-icon nc-zoom-split"></i>
                                    </Button>
                                </Form>
                                <Button className="col-md-3" color="success">
                                    <i className="nc-icon nc-simple-add"></i> Create a New Locker
                                </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead className="text-success">
                                        <tr>
                                            <th>ID</th>
                                            <th>Locker Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Mega</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Extra Large</td>
                                        </tr>
                                    </tbody>

                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Lockers;