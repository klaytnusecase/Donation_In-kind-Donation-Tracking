/**
 * Created by jaesonyoon on 2019. 4. 6..
 */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Button
} from 'reactstrap';

import s from './UserListVolunteer.scss';
import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchVolunteers } from '../../../actions/user';

class UserListVolunteer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    posts: PropTypes.array, // eslint-disable-line
    message: PropTypes.string,
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    message: '',
    errorMessage: '',
    posts: [],
  };

  static meta = {
    title: 'NPOs LIST',
    description: 'NPOs LIST',
  };

  componentWillMount() {
    this.props.dispatch(fetchVolunteers());
  }

  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <li className="breadcrumb-item">User Management</li>
          <BreadcrumbItem active>NPOs List</BreadcrumbItem>
        </Breadcrumb>
        <h1>NPOs List</h1>
        <Widget
          className="pb-0"
          title={
            <div>
              <h5 className="mt-0">
                <span className="fw-semi-bold">List</span>
              </h5>
            </div>
          }
        >
          <div className="widget-table-overflow">
            <Table striped>
              <thead>
              <tr>
                <th>User ID</th>
                <th>Institution</th>
                <th>E-mail</th>
                <th>Phone</th>
              </tr>
              </thead>
              <tbody>
              {this.props.posts &&
              this.props.posts.map(post => (
                <tr key={post.username}>
                  <td>{post.username}</td>
                  <td>{post.affiliation}</td>
                  <td>{post.e_mail}</td>
                  <td>{post.contacts}</td>
                </tr>
              ))}
              {this.props.posts &&
              !this.props.posts.length && (
                <tr>
                  <td colSpan="100">No NPOs yet</td>
                </tr>
              )}
              {this.props.isFetching && (
                <tr>
                  <td colSpan="100">Loading...</td>
                </tr>
              )}
              </tbody>
            </Table>
          </div>
        </Widget>
      </div>
    );
  }
}



// <td>{new Date(post.updatedAt).toLocaleString()}</td>

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.auth.message,
    errorMessage: state.auth.errorMessage,
    posts: state.auth.posts,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(UserListVolunteer)));
