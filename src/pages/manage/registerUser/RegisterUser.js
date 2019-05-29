/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withRouter, Redirect } from 'react-router';
import {
  Row,
  Col,
  Alert,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Input

} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';

import s from './RegisterUser.scss';

import {registerUser, saveKeystore} from '../../../actions/user';

class RegisterUser extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    message: PropTypes.string,
    errorMessage:  PropTypes.string,
  };

  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
  }

  constructor(props){
    super(props)
    this.state = {
      login: '',
      password: '',
      password_rep: '',
      affiliation: '',
      org_type: '',
    };
  }
  changeLogin = (event) => {
    this.setState({login: event.target.value});
  };

  changePassword = (event) => {
    this.setState({password: event.target.value});
  };
  changePasswordRep = (event) => {
    this.setState({password_rep: event.target.value});
  };

  changeAffiliation = (event) => {
    this.setState({affiliation: event.target.value});
  };
  changeOrgType = (event) => {
    this.setState({org_type: event.target.value});
  };

  doSubmit = (e) => {
    this.props.dispatch(
      registerUser({
        login: this.state.login,
        password: this.state.password,
        password_rep: this.state.password_rep,
        affiliation: this.state.affiliation,
        org_type: this.state.org_type,
      }),
    ).then (() =>
      this.props.dispatch(saveKeystore({login: this.state.login}))
    ).then(() =>
        this.setState({
          login: '',
          password: '',
          password_rep: '',
          affiliation: '',
          org_type: '',
        }),
      )
    e.preventDefault();
  }

  render() {
    return (
        <div className={s.root}>
          <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Management User</li>
          <li className="active breadcrumb-item">User Registration</li>
        </ol>

        <h1 className="page-title">User Registration</h1>
          <Row>
            <Col>
              <Widget className={s.widget}>
                <Form className="mt" onSubmit={this.doSubmit}>
                  {this.props.message && (
                    <Alert size="sm" color="info">
                      {this.props.message}
                    </Alert>
                  )}
                  {this.props.errorMessage && (
                    <Alert size="sm" color="danger">
                      {this.props.errorMessage}
                    </Alert>
                  )}
                  <FormGroup className="form-group">
                    <Input
                      className="no-border"
                      value={this.state.login}
                      onChange={this.changeLogin}
                      type="text"
                      required
                      name="username"
                      placeholder="User ID"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      className="no-border"
                      value={this.state.password}
                      onChange={this.changePassword}
                      type="password"
                      required
                      name="password"
                      placeholder="Password"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      className="no-border"
                      value={this.state.password_rep}
                      onChange={this.changePasswordRep}
                      type="password"
                      required
                      name="password_rep"
                      placeholder="Retype password"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      className="no-border"
                      value={this.state.org_type}
                      onChange={this.changeOrgType}
                      type="select"
                      required
                      name="org_type"
                    >
                    <option value ='' disabled hidden>Organization type</option>
                    <option value='member'>Member</option>
                    <option value='volunteer'>NPO</option>
                    </Input>
                  </FormGroup>
                  <FormGroup className="form-group">
                    <Input
                      className="no-border"
                      value={this.state.affiliation}
                      onChange={this.changeAffiliation}
                      type="text"
                      required
                      name="affiliation"
                      placeholder="Institution name"
                    />
                  </FormGroup>
                  <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
                    <ButtonGroup>
                    <Button color="success">
                      {this.props.isFetching ? 'Creating...' : 'Create'}
                    </Button>
                    </ButtonGroup>
                  </div>
                </Form>
              </Widget>
            </Col>
          </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    message: state.auth.message,
    errorMessage: state.auth.errorMessage,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(RegisterUser)));
