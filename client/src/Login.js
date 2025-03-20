import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post("http://localhost:5102/api/auth/login", values);

      console.log("Login Response:", response.data); // Debugging log

      const { token, newUser } = response.data;

      if (!token || !newUser) {
        throw new Error("Invalid API response: Missing token or user data");
      }

      // Store token in local storage
      localStorage.setItem("token", token);

      // Dispatch user data to Redux
      dispatch(setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        initialBalance: newUser.initialBalance,
        numberOfGroups: newUser.numberOfGroups,
        hasSetup: newUser.hasSetup,
      }));

      // Navigate to homepage after login
      navigate("/");

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      if (error.response?.data) {
        const { message } = error.response.data;

        if (message.includes("Invalid email or password")) {
          setErrors({ password: "Password is incorrect. Please try again." });
        } else if (message.includes("User not found")) {
          setErrors({ email: "User not found. Please check your email or register." });
        } else if (message.includes("Invalid email format")) {
          setErrors({ email: "The email format is invalid. Please enter a valid email." });
        } else {
          setErrors({ general: "Login failed. Please try again later." });
        }
      } else {
        setErrors({ general: "An error occurred. Please check your connection and try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="center-div">
        <div className="form-container">
          <div className="form-card">
            <h2 className="text-center mb-4">User Login</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
              {({ isSubmitting, errors }) => (
                <Form>
                  <FormGroup className="form-group">
                    <Label for="email">Email</Label>
                    <Field name="email" as={Input} type="email" id="email" className="form-input" /> <br/>
                    <ErrorMessage name="email" component="div" className="text-danger small" />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </FormGroup>

                  <FormGroup className="form-group">
                    <Label for="password">Password</Label>
                    <Field name="password" as={Input} type="password" id="password" className="form-input" />  <br/>
                    {/* <ErrorMessage name="password" component="div" className="text-danger small" /> */}
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                  </FormGroup>

                  {errors.general && <div className="text-danger">{errors.general}</div>}

                  <Button type="submit" color="primary" className="btn-block mt-3" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>

                  <div className="text-center mt-3">
                    <a href="/register">Don't have an account? Register here</a>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
