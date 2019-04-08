import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';

import {
  Row,
  Col,
  Input,
  Button,
  ButtonGroup,
  ButtonToolbar,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardDeck,
  Card,
  FormGroup,
  Form,
  Alert,
} from 'reactstrap';

import s from './../Checking.scss';
import withMeta from '../../../../core/withMeta';
import Widget from '../../../../components/Widget';
import { fetchPosts, fetchDonations, fetchBlkchain, fetchBoxDetails, updateBox, fetchNPO} from '../../../../actions/posts';
import {fetchCollectionsAndDonations, fetchCollectionsDistribution} from '../../../../actions/happiness';

// <td>{happyAlliance.methods.viewFinalBoxInformation(post).call().then(result=>{return result})}</td>

function convertObjtoArray(obj){
  const value = [];
  if(obj){
    const key = Object.keys(obj);
    for(let i=0; i< obj[key[0]].length; i++){
      value.push([obj[key[0]][i], obj[key[1]][i], JSON.parse(obj[key[2]][i]), obj[key[3]][i], obj[key[4]][i], obj[key[5]][i]])
    }
    return value;
  }
  return value;
}


function text_truncate(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };

class AdminChecking extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    existingBoxes: PropTypes.array,
    volunteers: PropTypes.array,
    info: PropTypes.object,
    npoBoxes: PropTypes.object,
  };

  static defaultProps = {
    isFetching: false,
    existingBoxes: [],
    info: {0: '', 1: '', 2: ''},
    volunteers: [],
    npoBoxes: {0:''},
  };

  static meta = {
    title: 'Posts list',
    description: 'About description',
  };

  handleBoxId = (event) => {
    this.setState({boxId: event.target.value});
  }
  handleTargetNPO = (event) => {
    this.setState({targetNPO: event.target.value});
  }
  handleRecipient = (event) => {
    this.setState({recipient: event.target.value});
  }
  handleTarget = (event) => {
    this.setState({updateTarget: event.target.value});
  }

  constructor(props) {
    super(props);
    this.state = {
      boxId: '',
      recipient: '',
      updateTarget: '',
      stuffs: '',
      targetNPO: '',
      targetBoxes: [],
    }
  }

  searchBox = (e) => {
    this.props
      .dispatch(
        fetchBoxDetails(String(this.state.boxId)),
      )
      .then((res) => this.setState({
          stuffs: JSON.parse(res[1])
      }));// window.location.reload()
    e.preventDefault();
  };

  searchNPO = (e) => {
    this.props
    .dispatch(
        fetchNPO(this.state.targetNPO),
      )
    .then((res) => this.setState({
        targetBoxes: convertObjtoArray(res),
      }))
    .catch(err => console.error('Error: ', err));
    e.preventDefault();
  }

  updateBox = (e) => {
    this.props.dispatch(
      updateBox({
        updateTarget: String(this.state.updateTarget),
        recipient: this.state.recipient,
      }))
      .then(()=> this.setState({
        updateTarget: '',
        recipient: '',
      }));
    e.preventDefault();
  }

  componentWillMount() {
    this.props.dispatch(fetchBlkchain());
    this.props.dispatch(fetchCollectionsDistribution());
  }

  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>박스탐색</BreadcrumbItem>
        </Breadcrumb>
        <h1>박스탐색 (from Blockchain) & 수혜내역 등록</h1>
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

        {this.props.orgType=="admin" &&
        <Widget>
          <h2>Search boxes by NPO</h2>
            <form onSubmit={this.searchNPO}>

              <Input
                  className="no-border"
                  value={this.state.targetNPO}
                  onChange={this.handleTargetNPO}
                  type="select"
                  required
                  name="targetNPO"
                >
                <option value ='' disabled hidden>NPO</option>
                {this.props.volunteers.map(volun => (
                    <option value={volun.username} key={volun.username}>{volun.affiliation}</option>
                  ))}
              </Input>

           <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
              <ButtonGroup>
              <Button color="success" type="submit">
                {this.props.isFetching ? 'Searching...' : 'Search'}
              </Button>
              </ButtonGroup>
            </div>
            </form>
        </Widget>
    	}

        <Widget>
          <h3>Number of total boxes: {this.props.existingBoxes.length - 1}</h3>
          <div className="widget-table-overflow">
            <Table striped>
              <thead>
              <tr>
                <th>Box ID</th>
                <th>상자종류</th>
                <th>상자구성</th>
                <th>수혜사 수령 일자</th>
                <th>수혜대상 정보</th>
                <th>수혜대상 수령 일자</th>
              </tr>
              </thead>
              <tbody>
              {this.state.targetBoxes &&
                this.state.targetBoxes.map(box => (
                  <tr key={box[0]}>
                      <td>{box[0]}</td>
                      <td>{box[1]}</td>
                      <td id="details">{box[2].map(stuff => `${stuff.name} ${stuff.quantity}개,`)}</td>
                      <td>{box[3] ? new Date(box[3]).toISOString().substring(0, 10) : "X"}</td>
                      <td>{box[4]}</td>
                      <td>{box[5] ? new Date(box[5]).toISOString().substring(0, 10) : "X"}</td>
                  </tr>
                  ))}
              {this.props.existingBoxes &&
              !this.props.existingBoxes.length && (
                <tr>
                  <td colSpan="100">No boxes yet</td>
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

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    existingBoxes: state.posts.existingBoxes,
    info: state.posts.info,
    volunteers: state.posts.volunteers,
    npoBoxes: state.posts.npoBoxes,
    orgType: state.auth.org_type,
    name: state.auth.name,
    message: state.posts.message,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(AdminChecking)));
