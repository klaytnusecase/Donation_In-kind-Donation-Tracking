import React, {Component} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  Alert,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  Progress,
  Badge,
  ListGroup,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Table
} from 'reactstrap';

import dbSchema from '../../../images/prisming_db_schema.png';
import Widget from '../../../components/Widget';

import {fetchDonations } from '../../../actions/posts';
import s from './ForVolunteer.scss';

class ForAdmin extends Component {
  /* eslint-disable */
  static propTypes = {
    posts: PropTypes.any,
    isFetching: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };
  /* eslint-enable */

  static defaultProps = {
    isFetching: false,
    posts: [],
  };

  state = {
    isDropdownOpened: false,
  };

  componentDidMount() {
    this.props.dispatch(fetchDonations());
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpened: !prevState.isDropdownOpened,
    }));
  }


  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>Dashboard</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-lg">Dashboard for volunteer</h1>
        <h1 className="mb-lg">Will be designed later</h1>

        <Row>
          <Col sm={12}>
            <Widget
              title={
                <div>
                  <div className="pull-right mt-n-xs">
                    {/* eslint-disable */}
                    {/* eslint-enable */}
                  </div>
                  <h5 className="mt-0 mb-0">
                    기부 리스트 {' '}
                  </h5>
                  <p className="fs-sm mb-0 text-muted">
                    멤버사로부터 기부 받은 내역
                  </p>
                </div>
              }
            >
            <Table responsive borderless className={cx('mb-0', s.usersTable)}>
                <thead>
                  <tr>
                    <th>멤버사 이름</th>
                    <th>기부 ID</th>
                    <th>신규/수정 상태</th>
                  </tr>
                </thead>
                <tbody>
                {this.props.posts &&
                this.props.posts.map(post => (
                  <tr key={post.id}>
                    <td>{post.company_id}</td>
                    <td><Link to={`/app/donation/${post.donation_id}`}>{post.donation_id}</Link></td>
                    <td>{post.is_new}</td>
                  </tr>
                ))}
                {this.props.isFetching && (
                  <tr>
                    <td colSpan="100">불러오는 중입니다.</td>
                  </tr>
                )}
                </tbody>
              </Table>

            </Widget>
          </Col>
          <Col sm={6}>
            <img src={dbSchema} alt="DB Schema" width="80%" />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    posts: state.posts.posts,
  };
}

export default connect(mapStateToProps)(withStyles(s)(ForAdmin));
