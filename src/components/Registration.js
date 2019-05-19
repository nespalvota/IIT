import React, { Component } from "react";
import { FormErrors } from "./formErrors.js";
import 

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      formErrors: { username: "", email: "", password: "", password2: "" },
      usernameValid: false,
      emailValid: false,
      passwordValid: false,
      password2Valid: false,
      formValid: false
    };
  }

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let password2Valid = this.state.password2Valid;

    switch (fieldName) {
      case "username":
        usernameValid = value.match(/^([\w.%+-]+)$/i);
        fieldValidationErrors.username = usernameValid
          ? ""
          : "Username is invalid";
        break;
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : "Email is invalid";
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : "Password is too short";
        break;
      case "password2":
        password2Valid = value === this.state.password;
        fieldValidationErrors.password2 = password2Valid
          ? ""
          : "Passwords do not match";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
        password2Valid: password2Valid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.emailValid &&
        this.state.passwordValid &&
        this.state.password2Valid
    });
  }

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  addUser() {
    app.post((req, res) => {
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
        .then(user => {
          req.session.user = user.dataValues;
          res.redirect("/home");
        })
        .catch(error => {
          res.redirect("/registration");
        });
    });

    console.log("ADD USER");
  }

  render() {
    return (
      <form className="demoForm">
        <h2>Sign up</h2>
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>
        <div
          className={`form-group ${this.errorClass(
            this.state.formErrors.username
          )}`}
        >
          <label htmlFor="email">Username</label>
          <input
            type="username"
            required
            className="form-control"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUserInput}
          />
        </div>
        <div
          className={`form-group ${this.errorClass(
            this.state.formErrors.email
          )}`}
        >
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            required
            className="form-control"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleUserInput}
          />
        </div>
        <div
          className={`form-group ${this.errorClass(
            this.state.formErrors.password
          )}`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleUserInput}
          />
        </div>
        <div
          className={`form-group ${this.errorClass(
            this.state.formErrors.password2
          )}`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            name="password2"
            placeholder="Password"
            value={this.state.password2}
            onChange={this.handleUserInput}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!this.state.formValid}
          onClick={this.addUser}
        >
          Sign up
        </button>
      </form>
    );
  }
}

export default RegistrationForm;
