import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Button
} from 'reactstrap';

import s from './DonationList.scss';
import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchPosts, fetchDonations, fetchDetails } from '../../../actions/posts';

class IndDonationList extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    details: PropTypes.array, // eslint-disable-line
    isFetching: PropTypes.bool,
    isNew: PropTypes.bool,
    hasPrev: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    details: [],
    isNew: false,
    hasPrev: false,
  };

  static meta = {
    title: 'Posts list',
    description: 'About description',
  };

  componentWillMount() {
    const id = this.props.match.params.id;
    this.props.dispatch(fetchDetails(id)).then(
      console.log(this.props.isNew)
    );
  }


  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>상세내역</BreadcrumbItem>
        </Breadcrumb>
        <h1>Donation ID: {this.props.match.params.id}</h1>
        <Widget
          className="pb-0"
          title={
            <div>
              <div className="pull-right mt-n-xs">
              {this.props.isNew&&(
                <Link to={`/app/donation/edit/${this.props.match.params.id}`} className="btn btn-sm btn-inverse">
                  수정하기
                </Link>
                )}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to="/app/donation" className="btn btn-sm btn-inverse">
                  돌아가기
                </Link>
              </div>
              <h5 className="mt-0">
                <span className="fw-semi-bold">목록</span>
              </h5>
            </div>
          }
        >
          <div className="widget-table-overflow">
            <Table striped>
              <thead>
              <tr>
                <th>속성</th>
                <th>상세</th>
              </tr>
              </thead>
              <tbody>
              {this.props.details &&
              this.props.details.map(post => (
                <tr key={post.column_type}>
                  <td>{post.column_type}</td>
                  <td>{post.detail}</td>
                </tr>
              ))}
              {this.props.details &&
              this.props.details.length && (
                <tr>
                  <td>멤버사 정보</td>
                  <td>{this.props.details[0].affiliation}</td>
                </tr>
              )}
              {this.props.details &&
              this.props.details.length && (
                <tr>
                  <td>작성자(수정자)</td>
                  <td>{this.props.details[0].editor}</td>
                </tr>
              )}
              {this.props.details &&
              this.props.details.length && (
                <tr>
                  <td>등록 일시</td>
                  <td>{this.props.details[0].created_at}</td>
                </tr>
              )}
              {this.props.details &&
              !this.props.details.length && (
                <tr>
                  <td colSpan="100">No posts yet</td>
                </tr>
              )}
              {this.props.isFetching && (
                <tr>
                  <td colSpan="100">Loading...</td>
                </tr>
              )}
              </tbody>
            </Table>

            {this.props.hasPrev && (
              <div className="pull-right mt-n-xs">
                <a href = {`/app/donation/${  this.props.details[0].prev_donation_id}`}>이전 기록 보기</a>
              </div>
              )}
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
    details: state.posts.details,
    isNew: state.posts.isNew,
    hasPrev: state.posts.hasPrev,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(withMeta(IndDonationList))));
