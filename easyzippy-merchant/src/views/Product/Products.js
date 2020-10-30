import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import {MDBCol, MDBIcon} from "mdbreact";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

function Products() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const merchantId = (JSON.parse(Cookies.get('merchantUser'))).toString()

    //const product = JSON.parse(localStorage.getItem('currentProduct'))

    //const [name, setName] = useState(product.name)

    //search by name
    const [searchTerm, setSearchTerm] = useState("")
    const [categories, setCategories] = useState([])

    const [newProdArr, setNewProdArr] = useState([])
    const [products, setProducts] = useState([])

    const [searchResults, setSearchResults] = useState([])

    const [imageArr, setImageArr] = useState([])

    //sorting 
    const [lowToHigh, setLowToHigh] = useState(true)

    //for delete confirmation
    const [modal, setModal] = useState(false)
    const toggleModal = id => {
        console.log(id)
        localStorage.setItem('productId', id)
        setModal(!modal);
    }

    //display image carousell
    const [imageModal, setImageModal] = useState(false)
    const toggleImageModal = (e, id) => {

        e.preventDefault()

        axios.get(`/product/${id}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            for (var i in res.data.images) {
                axios.get(`/assets/${res.data.images[i]}`, {
                    responseType: 'blob'
                },
                {
                    headers: {
                        AuthToken: authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    console.log('axios images thru')
                    var file = new File([response.data], {type:"image/png"})
                    let image = URL.createObjectURL(file)

                    let obj = {
                        key: i,
                        src: URL.createObjectURL(file),
                        alttext: 'product image',
                        caption: 'Image ' + i,
                    }

                    setImageArr(imageArr => [...imageArr, obj])
                }).catch (function (error) {
                    console.log(error.response.data)
                })
            }

        }).catch (function(error) {
            console.log(error.response.data)
        })

        setImageModal(!imageModal)

        // if closed, remove everything from imagearray
        if (imageModal === false) {
            setImageArr([])
        }
    }

    let productArr = []
    let tempProdArr = []
    let tempCat = []

    useEffect(() => {
        //retrieving all products
        axios.get(`/merchantProducts/${merchantId}`, {
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
                let imgarr = []

                console.log(productArr[i])
                axios.get(`/assets/${productArr[i].images[0]}`, {
                    responseType: 'blob'
                },
                {
                    headers: {
                        AuthToken: authToken,
                        'Content-Type': 'application/json'
                    }
                }).then (r => {
                    console.log("axios images thru: " + r.data)
                    var file = new File([r.data], {type:"image/png"})
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
                    console.log(p.image)
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

    // function group(arr, key) {
    //     return [...arr.reduce( (acc, o) => 
    //         acc.set(o[key], (acc.get(o[key]) || []).concat(o))
    //     , new Map).values()];
    // }

    const deleteProduct = e => {
        e.preventDefault()

        const productId = localStorage.getItem('productId')

        axios.put(`/deleteProduct/${productId}`, 
        {
            id: productId
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            //later see
            console.log("axios delete product went through")
            window.location.reload()
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
                                        <FormGroup className="form-inline mt-4 mb-4 col-md-6">
                                            <MDBIcon icon="search" />
                                            <input 
                                            className="form-control form-control-sm ml-3 w-75" 
                                            type="text" 
                                            placeholder="Search by name/category" 
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            aria-label="Search" />
                                        </FormGroup>
                                        <FormGroup className="form-inline mt-4 mb-4 col-md-3">
                                        <Label>Sort by Price</Label>
                                            <Button className="btn-icon btn-neutral" onClick={sortByPrice}>
                                            <i className="fas fa-sort" />
                                            </Button>
                                            {/* &nbsp; 
                                            <div style={{float: "right"}}>
                                            <Button color="info" size="sm" onClick={() => {
                                                history.push('/admin/listProduct')
                                            }}> <i className="nc-icon nc-simple-add"/> {''}
                                                List a Product
                                            </Button>

                                            </div> */}
                                        </FormGroup>
                                        <FormGroup className="form-inline mt-4 mb-4 col-md-3">
                                        <div style={{float: "right"}}>
                                            <Button color="info" size="sm" onClick={() => {
                                                    history.push('/admin/listProduct')
                                                }}> <i className="nc-icon nc-simple-add"/> {''}
                                                    List a Product
                                                </Button>
                                        </div>
                                        </FormGroup>
                                        {/* <Col className="mt-4 mb-4 col-md-6" > */}
                                            {/* <Label>Sort by Price</Label>
                                            <Button className="btn-icon btn-neutral" onClick={sortByPrice}>
                                            <i className="fas fa-sort" />
                                            </Button>
                                            &nbsp; 
                                            <div style={{float: "right"}}>
                                            <Button color="info" size="sm" onClick={() => {
                                                history.push('/admin/listProduct')
                                            }}> <i className="nc-icon nc-simple-add"/> {''}
                                                List a Product
                                            </Button>

                                            </div> */}
                                        {/* </Col> */}
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="form-row">
                                        {
                                            searchResults.map(prod => (
                                                <Card style={{width: '22rem', margin:'0.45rem'}} className="text-center" key={prod.id} >
                                                    <CardImg style={{height:'25rem'}} top src={prod.image} onClick={e => {toggleImageModal(e, prod.id)}}/>
                                                    {/* <CardImg top src="../../easyzippylogo.jpg"/> */}
                                                    <CardBody>
                                                        <CardTitle className="h6">{prod.name}</CardTitle>
                                                        <CardText>${prod.unitPrice}</CardText>
                                                        <CardText>Category: {prod.category}</CardText>
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
                        <Modal isOpen={imageModal} toggle={toggleImageModal}>
                            <ModalHeader toggle={toggleImageModal}>Product Images</ModalHeader>
                            <ModalBody>
                                <Slider dots={true} infinite={true} speed={1000} slidesToScroll={1} arrows={true} slidesToShow={1}  >
                                    {
                                        imageArr.map(image => (
                                            <img key={image.key} src={image.src}/>
                                        ))
                                    }
                                </Slider>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Products;