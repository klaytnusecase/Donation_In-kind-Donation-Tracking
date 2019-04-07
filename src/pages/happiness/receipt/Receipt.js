import React from 'react';
import PropTypes from 'prop-types';
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
  Alert,
  Table,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchDonationsForHappiness, fetchAllBoxes } from '../../../actions/posts';
import { createCollection} from '../../../actions/happiness';
import { fetchSwitch} from '../../../actions/configuration';
import { CSVLink, CSVDownload } from "react-csv";

function convertObjtoArray(obj){
  const value = [];
  if(obj){
    const key = Object.keys(obj);
    for(let i=0; i< obj[key[0]].length; i++){
      value.push([obj[key[0]][i], obj[key[1]][i], JSON.parse(obj[key[2]][i]), obj[key[3]][i]])
    }
    return value;
  }
  return value;
}

function expandDonationArray(arr) {
  const size = arr.length;
  let boxIdExpand = [];
  let npoExpand = [];
  let donationIdExpand = [];
  let quantityExpand = [];
  for(let i = 0; i < size; i++) {
    let tmpDonation = arr[i][2];
    for(let j = 0; j < tmpDonation.length; j++){
      boxIdExpand.push(arr[i][0]);
      npoExpand.push(arr[i][3]);
      donationIdExpand.push(tmpDonation[j].donation_id);
      quantityExpand.push(tmpDonation[j].quantity);
    }
  }
  //return({boxId: boxIdExpand, npo: npoExpand, donationId: donationIdExpand, quantity: quantityExpand});
  return([boxIdExpand, npoExpand, donationIdExpand, quantityExpand])
}

let headers = [
  { label: "박스ID", key: "boxId" },
  { label: "수혜사", key: "npo" },
  { label: "기부ID", key: "donationId" },
  { label: "수량", key: "quantity" }
];

function forReactCSV(arr) {
  const size = arr.length;
  let data = [];
  for(let i = 0; i < size; i++) {
    let tmpDonation = arr[i][2];
    for(let j = 0; j < tmpDonation.length; j++){
      data.push({boxId: arr[i][0], npo: arr[i][3], donationId: tmpDonation[j].donation_id, quantity: tmpDonation[j].quantity});
    }
  }
  return(data);
}


class Receipt extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string,
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool,
    posts: PropTypes.array,
    switches: PropTypes.object,
    allBoxes: PropTypes.object,
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
    posts: [],
    switches: {},
    allBoxes: {},
  };
  static meta = {
    title: 'Generate receipts',
    description: 'About description',
  };
  componentWillMount() {
    this.props.dispatch(fetchAllBoxes())
    .then((res) => convertObjtoArray(res))
    .then((res) => this.setState({
        allBoxes: res.slice(1),
      }))
      .then(()=> this.setState({
        uniqueType: new Set(this.state.allBoxes.map(box=>box[1])),
        uniqueDate: new Set(this.state.allBoxes.map(box=>box[5])),
      }))
      .then(()=> this.setState({
        //expandData: expandDonationArray(this.state.allBoxes),
        expandData: forReactCSV(this.state.allBoxes),
      }))
    .catch(err => console.error('Error: ', err));
    //this.props.dispatch(fetchSwitch()).then(()=> {
    //  if (this.props.switches.switch_3 === true) {
    //    window.alert('이미 최종배분이 완료 되었습니다');
    //    window.location.replace('/app');
    //  }
    //});
  }
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      donations: this.props.posts,
      uniqueType: [],
      allBoxes: [],
    }
  }


  render() {
    console.log(this.state);
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">기부 영수증 발급</li>
        </ol>

        <h1 className="page-title">영수증 발급하기</h1>
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

        <h5>전체 데이터 다운로드</h5>
        {this.state.expandData && <CSVLink data={this.state.expandData} headers={headers}>Download me</CSVLink>}

        <Widget>
          <div className="widget-table-overflow">
            <Table striped>
              <thead>
              <tr>
                <th>박스 ID</th>
                <th>수혜사</th>
                <th>기부 ID</th>
                <th>수량</th>
              </tr>
              </thead>

              <tbody>
              {this.state.expandData &&
                this.state.expandData.map(data => (
                  <tr>
                      <td>{data.boxId}</td>
                      <td>{data.npo}</td>
                      <td>{data.donationId}</td>
                      <td>{data.quantity}</td>
                  </tr>
                  ))}

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
    message: state.posts.message,
    errorMessage: state.posts.errorMessage,
    posts: state.posts.posts,
    switches: state.posts.switches,
    allBoxes: state.posts.allBoxes,
  };
}

export default connect(mapStateToProps)((withMeta(Receipt)));
