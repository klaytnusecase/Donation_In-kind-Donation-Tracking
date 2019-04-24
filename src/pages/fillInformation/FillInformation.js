import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  Alert
} from 'reactstrap';
import Widget from '../../components/Widget';
import withMeta from '../../core/withMeta';

import s from './FillInformation.scss';
import { connect } from 'react-redux';

import {fetchInformation, changeInformation, saveKeystore} from '../../actions/user'

const Caver = require('caver-js');
const caver = new Caver('http://127.0.0.1:8551');

class RegisterDonation extends PureComponent {
  static propTypes = {
    message: PropTypes.string,
    errorMessage:  PropTypes.string,
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
  };

  static meta = {
    title: 'Change password',
    description: 'About description',
  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      password_rep: '',
      affiliation: '',
      address: '',
      representative_name: '',
      e_mail: '',
      contacts: ''
    };
  }

  componentWillMount() {
    const name = this.props.name;
    this.props.dispatch(fetchInformation(name)).then(() =>
      this.setState({
        affiliation: this.props.details.affiliation,
        address: this.props.details.address,
        representative_name: this.props.details.representative_name,
        e_mail: this.props.details.e_mail,
        contacts: this.props.details.contacts
      })
    )
  }

  changePassword = (event) => {
    this.setState({password: event.target.value});
  };
  changePasswordRep = (event) => {
    this.setState({password_rep: event.target.value});
  };
  changeAffiliation = (event) => {
    this.setState({affiliation: event.target.value});
  };
  changeRepresentativeName = (event) => {
    this.setState({representative_name: event.target.value});
  };
  changeAddress = (event) => {
    this.setState({address: event.target.value});
  };
  changeEMail = (event) => {
    this.setState({e_mail: event.target.value});
  };
  changeContacts = (event) => {
    this.setState({contacts: event.target.value});
  };

  doChangePassword = (e) => {
    this.props
      .dispatch(
        changeInformation({
        name: this.props.name,
        password: this.state.password,
        password_rep: this.state.password_rep,
        affiliation: this.state.affiliation,
        address: this.state.address,
        representative_name: this.state.representative_name,
        e_mail: this.state.e_mail,
        contacts: this.state.contacts
      }))
      .then(() =>
        this.setState({
          password: '',
          password_rep: '',
        }),
      ).then(this.props.dispatch(fetchInformation(this.props.name)));
    e.preventDefault();
  };

  handleSaveToPC = (address, jsonData) => {
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = address+'.json';
    link.href = url;
    link.click();
  };

  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>현재 위치</BreadcrumbItem>
          <BreadcrumbItem active>비밀번호 변경하기</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-lg">비밀번호 변경하기</h1>
        <Row>
          <Col sm={8}>
            <Widget>
              <Form onSubmit={this.doChangePassword}>
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
                <FormGroup>
                    <Label for="input-title">비밀번호</Label>
                    <Input
                      className="no-border"
                      value={this.state.password}
                      onChange={this.changePassword}
                      type="password"
                      required
                      name="password"
                      placeholder="비밀번호"
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
                      placeholder="비밀번호 재입력"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="input-title">기관명</Label>
                    <Input
                      className="no-border"
                      value={this.state.affiliation}
                      onChange={this.changeAffiliation}
                      type="text"
                      required
                      name="corp_name"
                      placeholder="기관명"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="input-title">법인 대표명</Label>
                    <Input
                      className="no-border"
                      value={this.state.representative_name}
                      onChange={this.changeRepresentativeName}
                      type="text"
                      required
                      name="representative_name"
                      placeholder="법인 대표명"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="input-title">법인 주소지</Label>
                      <Input
                        className="no-border"
                        value={this.state.address}
                        onChange={this.changeAddress}
                        type="text"
                        required
                        name="address"
                        placeholder="주소지"
                      />
                  </FormGroup>
                  <FormGroup>
                    <Label for="input-title">연락가능 이메일</Label>
                      <Input
                        className="no-border"
                        value={this.state.e_mail}
                        onChange={this.changeEMail}
                        type="email"
                        required
                        name="e-mail"
                        placeholder="연락가능 이메일"
                      />
                  </FormGroup>
                  <FormGroup>
                    <Label for="input-title">연락처</Label>
                      <Input
                        className="no-border"
                        value={this.state.contacts}
                        onChange={this.changeContacts}
                        type="tel"
                        required
                        name="contacts"
                        placeholder="연락처"
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
    isFetching: state.posts.isFetching,
    message: state.auth.message,
    errorMessage: state.auth.errorMessage,
    name: state.auth.name,
    details: state.auth.details,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(RegisterDonation)));
