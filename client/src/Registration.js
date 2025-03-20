import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormGroup, Label, Input, Button } from "reactstrap";
import './Registration.css'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/userSlice';
function Registration() {
const navigate=useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

 const onSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    // Step 1: Register User (POST Request)
    const registerResponse = await axios.post("http://localhost:5102/api/auth/register", {
      name: values.name,
      email: values.email,
      password: values.password,
    });

    console.log("Registration Response:", registerResponse.data);

    // Ensure the response contains user data and token
    if (!registerResponse.data.user || !registerResponse.data.token) {
      throw new Error("Invalid API response: Missing user data or token");
    }

    // Step 2: Save token in local storage
    localStorage.setItem("token", registerResponse.data.token);

    // Step 3: Dispatch User Data to Redux Store
    const { user } = registerResponse.data;

    dispatch(setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      initialBalance: user.initialBalance,
      numberOfGroups: user.numberOfGroups,
      hasSetup: user.hasSetup,
    }));

    // Step 4: Navigate to home page
    navigate('/');
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Something went wrong!");
  } finally {
    setSubmitting(false);
  }
};


  function loginbtn(){
    navigate('/login');
  }

  return (
    <div className='registration-page'>
      <div className='center-div'>
        <div className="form-container">
          <div className="form-card">
            <h2 className="text-center mb-4">Register Here!!!</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form >
                  <FormGroup className='form-group'>
                    <Label for="name">Name</Label>
                    <Field name="name" as={Input} type="text" id="name" className="form-input"/> <br/>
                    <ErrorMessage name="name" component="div" className="text-danger small" />
                  </FormGroup>

                  <FormGroup className='form-group'>
                    <Label for="email">Email</Label>
                    <Field name="email" as={Input} type="email" id="email" className="form-input"/>  <br/>
                    <ErrorMessage name="email" component="div" className="text-danger small" />
                  </FormGroup>

                  <FormGroup className='form-group'>
                    <Label for="password">Password</Label>
                    <Field name="password" as={Input} type="password" id="password" className="form-input"/>  <br/>
                    <ErrorMessage name="password" component="div" className="text-danger small" />
                  </FormGroup>

                  <FormGroup className='form-group'>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Field name="confirmPassword" as={Input} type="password" id="confirmPassword" className="form-input"/>  <br/>
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
                  </FormGroup>

                  
                  <Button type="submit" color="primary" className="btn-block mt-3" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>  <Button color="primary" className="btn-block mt-3" onClick={loginbtn}>
                   Existing User? Login Here
                  </Button>
                  
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
