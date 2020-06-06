import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/authAction";
import PropTypes from "prop-types";
import AlertLayout from "../layout/AlertLayout";

const Login = ({ login, isAuthenticatedProps }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ email, password });
    window.scrollTo(0, 0);
  };

  //Redirect if logged in
  if (isAuthenticatedProps) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <Fragment>
      <AlertLayout />
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticatedProps: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticatedProps: state.authReducer.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
