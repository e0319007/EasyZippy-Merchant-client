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
    ModalFooter
} from "reactstrap";

function Products() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    //const product = JSON.parse(localStorage.getItem('currentProduct'))

    //const [name, setName] = useState(product.name)

    //search by name
    const [searchTerm, setSearchTerm] = useState("")
    const [categories, setCategories] = useState([])

    const [newProdArr, setNewProdArr] = useState([])
    const [products, setProducts] = useState([])

    const [searchResults, setSearchResults] = useState([])

    //sorting 
    const [lowToHigh, setLowToHigh] = useState(true)

    //for delete confirmation
    const [modal, setModal] = useState(false)
    const toggleModal = id => {
        localStorage.setItem('productId', id)
        setModal(!modal);
    }

    let productArr = []
    let tempProdArr = []
    let tempCat = []

    //not sure why need this but okay
    const productId = JSON.parse(localStorage.getItem('productToView'))

    useEffect(() => {
        //retrieving all products
        axios.get('/products', {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("successfully retrieve products")
            setProducts(res.data)

            productArr = res.data

            axios.get('/categories', {
                headers: {
                    AuthToken: authToken
                }
            }).then (response => {
                console.log("successfully retrieve categories")
                setCategories(response.data)
                tempCat = response.data
            }).catch(err => console.error(err))

            //set pictures to pictures array that also has the product id
            //right now only consider the first picture
            for (var i in productArr) { //this one loops the product array and gets the image from the product
                let index = i
                console.log(productArr[i])
                axios.get(`/assets/${productArr[i].images[0]}`, {
                    responseType: 'blob'
                },
                {
                    headers: {
                        AuthToken: authToken,
                        'Content-Type': 'application/json'
                    }
                }).then (res => {
                    console.log("axios images thru: " + res.data)
                    var file = new File([res.data], {type:"image/png"})
                    let image = URL.createObjectURL(file)

                    let category = ''

                    for (var j in tempCat) {
                        if (productArr[index].categoryId === tempCat[j].id) {
                            category = tempCat[j].name
                        }
                    }

                    const p = {
                        id: productArr[index].id, 
                        name: productArr[index].name, 
                        unitPrice: productArr[index].unitPrice, 
                        image: image, 
                        disabled: productArr[index].disabled,
                        imageurl: [productArr[index].images[0]],
                        categoryId: productArr[index].categoryId, 
                        category: category, 
                        archived: productArr[index].archived,
                        description: productArr[index].description,
                        quantityAvailable: productArr[index].quantityAvailable, 
                        merchantId: productArr[index].merchantId
                    }

                    setNewProdArr(newProdArr => [...newProdArr, p])
                    tempProdArr.push(p)

                    //filtering searching etc here
                    const resultName = tempProdArr.filter(p => p.name.toLowerCase().includes(searchTerm));
                    const resultCategories = tempProdArr.filter(p => p.category.toLowerCase().includes(searchTerm));
                    let resultArr = [...new Set([...resultName,...resultCategories])]
                    
                    //sort here
                    if (lowToHigh) {
                        resultArr.sort((a, b) => a.unitPrice - b.unitPrice)
                    } else {
                        resultArr.sort((a, b) => b.unitPrice - a.unitPrice)
                    }

                    setSearchResults(resultArr)

                }).catch (err => console.error(err))
            }
        }).catch(err => console.error(err))

    },[searchTerm, lowToHigh])

    const deleteProduct = e => {
        e.preventDefault()

        axios.put(`/deleteProduct/${productId}`, {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            //later see
            console.log("axios delete product went through")
            const allProducts = products.filter(item => item.productId !== productId)
            setProducts(allProducts)
        }).catch(function (error) {
            console.log(error.response.data)
        })
    }

    const handleSearchChange = e => {
        setSearchTerm(e.target.value)
    }

    const sortByPrice = e => {
        let toggle = lowToHigh
        setLowToHigh(!toggle)
    }

    return(   
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Products</CardTitle>
                                    {/* <MDBCol md="6"> */}
                                        <form className="form-inline mt-4 mb-4">
                                            <MDBIcon icon="search" />
                                            <input 
                                            className="form-control form-control-sm ml-3 w-75" 
                                            type="text" 
                                            placeholder="Search by name/category" 
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            aria-label="Search" />
                                        </form>
                                        <Col md="1" sm="1" xs="3">
                                            <p className="category">Sort by Price</p>
                                            <Button className="btn-icon btn-neutral" onClick={sortByPrice}>
                                            <i className="fas fa-sort" />
                                            </Button>
                                        </Col>
                                    {/* </MDBCol> */}   
                                    &nbsp;&nbsp;&nbsp;
                                    <Button class="float-right" color="info" onClick={() => {
                                        history.push('/admin/listProduct')
                                    }}> <i className="nc-icon nc-simple-add"/> {''}
                                        List a Product
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="form-row">
                                        {
                                            searchResults.map(prod => (
                                                <Card style={{width: '22rem', margin:'0.45rem'}} className="text-center" key={prod.id} >
                                                    <CardImg top src={prod.image}/>
                                                    {/* <CardImg top src="../../easyzippylogo.jpg"/> */}
                                                    <CardBody>
                                                        <CardTitle className="h6">{prod.name}</CardTitle>
                                                        <CardText>${prod.unitPrice}</CardText>
                                                        <CardText>{prod.archived}</CardText>
                                                        {/* product details page */}
                                                        <Button color="primary" onClick={() => {
                                                            history.push('/admin/productDetails')
                                                            localStorage.setItem('productToView', JSON.stringify(prod))
                                                        }}>
                                                            <i className="fa fa-info-circle"/>
                                                        </Button>
                                                        <Button color="danger" onClick={() => {toggleModal(prod.id)}}>
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
                            <ModalHeader toggle={toggleModal}>Are you sure you want to delete this item?</ModalHeader>
                            <ModalFooter>
                                <Button color="danger" onClick={deleteProduct}>Delete</Button>
                                <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Products;