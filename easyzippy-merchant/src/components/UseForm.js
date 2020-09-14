import React, { useState } from 'react'

export function UseForm(initialValues) {

    const [values, setValues] = useState(initialValues);
   // const [errors, setErrors] = useState({});

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues ({
            ...values,
            [name]: value
        })
       
    }

    const resetForm = () => {
        setValues(initialValues);
        //setErrors({})
    }

    return {
        values, 
        setValues,
        //errors,
        //setErrors,
        handleInputChange,
        resetForm
    }
}


export function Form(props) { 
    const { children, ...other } = props
    return (
        <form {...other}>
            {props.children}
        </form>
    )
}

