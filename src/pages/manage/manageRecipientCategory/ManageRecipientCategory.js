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
  Label

} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';

import s from './ManageRecipientCategory.scss';

import {registerRecipientCategory,fetchRecipientCategory} from '../../../actions/configuration';

class ManageRecipientCategory extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    message: PropTypes.string,
    errorMessage:  PropTypes.string,
    categoriesType1: PropTypes.array,
    categoriesType2: PropTypes.array,
  };

  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
    categoriesType1: [{ category: ""}],
    categoriesType2: [{ category: ""}],
  };

  constructor(props){
    super(props);
    this.state = {
      categoryArrayType1: [{ category: ""}],
      categoryArrayType2: [{ category: ""}]
    };
  }
  componentWillMount() {
    this.props.dispatch(fetchRecipientCategory());
  }
  componentWillReceiveProps(nextProps){
    this.setState({
        categoryArrayType1 : nextProps.categoriesType1,
        categoryArrayType2 : nextProps.categoriesType2,
    });
  }

  handleAddCategoryType1 = () => {
    this.setState({
      categoryArrayType1: this.state.categoryArrayType1.concat([{category: ""}])
    });
  };

  handleCategoryValueChangeType1 = idx => evt => {
    const newcategoryArray = this.state.categoryArrayType1.map((category, sidx) => {
      if (idx !== sidx) return category;
      return { ...category, category: evt.target.value };
    });
    this.setState({ categoryArrayType1: newcategoryArray });
  };
  handleRemoveCategoryType1= idx => () => {
    this.setState({
      categoryArrayType1: this.state.categoryArrayType1.filter((s, sidx) => idx !== sidx)
    });
  };

  handleAddCategoryType2 = () => {
    this.setState({
      categoryArrayType2: this.state.categoryArrayType2.concat([{category: ""}])
    });
  };

  handleCategoryValueChangeType2 = idx => evt => {
    const newcategoryArray = this.state.categoryArrayType2.map((category, sidx) => {
      if (idx !== sidx) return category;
      return { ...category, category: evt.target.value };
    });
    this.setState({ categoryArrayType2: newcategoryArray });
  };

  handleRemoveCategoryType2= idx => () => {
    this.setState({
      categoryArrayType2: this.state.categoryArrayType2.filter((s, sidx) => idx !== sidx)
    });
  };


  doSubmitType1 = (e) => {
    this.props.dispatch(
      registerRecipientCategory({
        categoryArray: this.state.categoryArrayType1,
        type: 'type1'
      }),
    ).then(
      this.props.dispatch(fetchRecipientCategory())
    );
    e.preventDefault();
  };

  doSubmitType2 = (e) => {
    this.props.dispatch(
      registerRecipientCategory({
        categoryArray: this.state.categoryArrayType2,
        type: 'type2'
      }),
    ).then(
      this.props.dispatch(fetchRecipientCategory())
    );
    e.preventDefault();
  };


  render() {
    return (
        <div className={s.root}>
          <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">User Management</li>
          <li className="active breadcrumb-item">Manage Recipient Category</li>
        </ol>

        <h1 className="page-title">Manage Recipient Category</h1>
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
            <Col sm ={6}>
              <Widget className={s.widget}>
                <Form className="mt_1" onSubmit={this.doSubmitType1}>
                  <Label for="input-content">Age Category<br/></Label>
                {this.state.categoryArrayType1.map((category, idx) => (
                  <React.Fragment key={`repetition${  idx}`}>
                  <FormGroup key = {`category${  idx}`}>
                    <div  className="d-flex justify-content-start" key = {`category${  idx}`}>
                    <Input
                      value= {category.category}
                      onChange = {this.handleCategoryValueChangeType1(idx)}
                      type="text"
                      required
                      placeholder = "Category to add"
                      style={{ width:"70%" }}
                      />
                    <Button
                    color="danger"
                    onClick={this.handleRemoveCategoryType1(idx)}
                    size="sm"
                    >
                      Remove
                    </Button>
                    </div>
                  </FormGroup>
                  <hr/>
                  </React.Fragment>
              ))}
              <Button
                color = "info"
                size="sm"
                onClick = {this.handleAddCategoryType1}
              >
              Add Category
              </Button>

                  <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
                    <ButtonGroup>
                    <Button color="success">
                      {this.props.isFetching ? 'Saving...' : 'Save'}
                    </Button>
                    </ButtonGroup>
                  </div>
                </Form>
              </Widget>
            </Col>
            <Col sm ={6}>
              <Widget className={s.widget}>
                <Form className="mt_2" onSubmit={this.doSubmitType2}>
                  <Label for="input-content">Special Category<br/></Label>
                {this.state.categoryArrayType2.map((category, idx) => (
                  <React.Fragment key={`repetition${  idx}`}>
                  <FormGroup key = {`category${  idx}`}>
                    <div  className="d-flex justify-content-start" key = {`category${  idx}`}>
                    <Input
                      value= {category.category}
                      onChange = {this.handleCategoryValueChangeType2(idx)}
                      type="text"
                      required
                      placeholder = "Category to add"
                      style={{ width:"70%" }}
                      />
                    <Button
                    color="danger"
                    onClick={this.handleRemoveCategoryType2(idx)}
                    size="sm"
                    >
                      지우기
                    </Button>
                    </div>
                  </FormGroup>
                  <hr/>
                  </React.Fragment>
              ))}
              <Button
                color = "info"
                size="sm"
                onClick = {this.handleAddCategoryType2}
              >
              Add Category
              </Button>
                  <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
                    <ButtonGroup>
                    <Button color="success">
                      {this.props.isFetching ? 'Saving...' : 'Save'}
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
    message: state.posts.message,
    errorMessage: state.posts.errorMessage,
    categoriesType1: state.posts.categoriesType1,
    categoriesType2: state.posts.categoriesType2,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(ManageRecipientCategory)));


