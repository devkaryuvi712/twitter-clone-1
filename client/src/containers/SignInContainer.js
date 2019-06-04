import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';
import SignIn from '../components/SignIn';
import validateForm from '../utils/validateForm';

class SignInContainer extends Component {
  state = {
    username: '',
    password: '',
    errors: {},
    redirect: false
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.setState(() => ({ redirect: true }));
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleErrors = errors => {
    this.setState(() => ({ errors }));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    const userData = {
      username,
      password
    };

    const errors = validateForm(userData);
    if (errors) {
      return this.handleErrors(errors);
    }

    this.props.loginUser(userData, this.props.history);
  };

  render() {
    const { username, password, redirect } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (redirect) {
      return <Redirect to={from} />;
    }

    return (
      <SignIn
        username={username}
        password={password}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        errors={this.props.errors}
      />
    );
  }
}

SignInContainer.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth, errors }) => ({
  auth,
  errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(SignInContainer);