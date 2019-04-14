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
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,

} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';

import s from './ManageSeason.scss';

import {fetchSeason,changeSeason} from '../../../actions/configuration';

class manageSeason extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    message: PropTypes.string,
    errorMessage:  PropTypes.string,
    season: PropTypes.object,
  };

  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
    season: {},
  };

  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
    this.changeBackdrop = this.changeBackdrop.bind(this);
    this.state = {
      dummy: '',
      model: false
    };
  }
  componentWillMount() {
    this.props.dispatch(fetchSeason());
  }

  dummyChange = (event) => {
    this.setState({dummy: event.target.value});
  }

    toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  changeBackdrop(e) {
    let value = e.target.value;
    if (value !== 'static') {
      value = JSON.parse(value);
    }
    this.setState({ backdrop: value });
  }

  moveToNextSeason = (e) => {
    let season_int = parseInt(this.props.season.stringify_data);
    this.toggle()
    this.props
      .dispatch(
        changeSeason({
          season: season_int + 1,
        })
      ).then(this.props.dispatch(fetchSeason()));
  }



  render() {
    return (
        <div className={s.root}>
          <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">환경설정</li>
          <li className="active breadcrumb-item">시즌 관리</li>
        </ol>

        <h1 className="page-title">시즌 관리</h1>
          <Row>
            <Col>
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
            </Col>
          </Row>
          <Row>
            <Col>
              <Widget className={s.widget}>
                <Form className="mt_1" onSubmit={this.doSubmitType1}>
                  <Label for="input-content">현재 시즌<br/></Label>
                  <FormGroup key = {`season`}>
                    <div  className="d-flex justify-content-start" key = {`season`}>
                    <Input
                      value= {this.props.season.stringify_data}
                      type="text"
                      onChange = {this.dummyChange}
                      required
                      placeholder = "추가할 카테고리"
                      style={{ width:"70%" }}
                      disabled
                      />
                    </div>
                  </FormGroup>
                  <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
                    <ButtonGroup>
                    <Button color="success" onClick={this.toggle}>
                      {this.props.isFetching ? 'Creating...' : '다음 시즌으로 넘어가기'}
                    </Button>
                    </ButtonGroup>
                  </div>
                </Form>
              </Widget>
            </Col>
          </Row>
          <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop={this.state.backdrop}>
            <ModalHeader toggle={this.toggle}>
              주의하세요!
            </ModalHeader>
              <ModalBody>
                다음 시즌으로 넘어갈지 다시 한 번 확인합니다.
                {this.props.season.stringify_data}
              </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={this.moveToNextSeason}>
                넘어가기
              </Button>
            </ModalFooter>
          </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.posts.message,
    errorMessage: state.posts.errorMessage,
    season: state.posts.season,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(manageSeason)));


