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
import { createCollection, fetchForReceipt } from '../../../actions/happiness';
import { fetchSwitch} from '../../../actions/configuration';
import {fetchVolunteers} from '../../../actions/user';
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

function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}



let headers = [
  { label: "수혜사", key: "npoName" },
  { label: "기부물품", key: "name" },
  { label: "수량", key: "quantitySum" },
  { label: "가격", key: "price" },
  { label: "총액", key: "totalSum" },
  { label: "멤버사", key: "member" },
];


function expandDonationArray(arr, info, volun) {
  const size = arr.length;
  let volunId = [...new Set(volun.map(v=>v.username))];
  let volunName = [...new Set(volun.map(v=>v.affiliation))];
  let volunDict = {}
  for(let i =0; i<volunId.length;i++){
    volunDict[volunId[i]] = volunName[i];
  }


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

  const data = []
  let uniqueNPO = [...new Set(npoExpand)];
  let uniqueDonationID = [...new Set(donationIdExpand)];
  for(let i = 0; i < uniqueNPO.length; i++) {
    for(let j = 0; j < uniqueDonationID.length; j++){
      let idx1 = getAllIndexes(npoExpand, uniqueNPO[i]);
      let idx2 = getAllIndexes(donationIdExpand, uniqueDonationID[j]);
      let intersection = idx1.filter(value => idx2.includes(value));
      if(intersection.length!==0){
        let value = 0;
        for(let k=0; k<intersection.length; k++){
          value += Number(quantityExpand[intersection[k]]);
        }
        data.push({npoId: uniqueNPO[i], npoName: volunDict[uniqueNPO[i]], donationId: uniqueDonationID[j], quantitySum: value,
          name:info[uniqueDonationID[j]].name, price: info[uniqueDonationID[j]].price,
          member: info[uniqueDonationID[j]].affiliation, totalSum: value*info[uniqueDonationID[j]].price});
      }
    }
  }
  //return({boxId: boxIdExpand, npo: npoExpand, donationId: donationIdExpand, quantity: quantityExpand});
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
    receipt: PropTypes.any,
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
    posts: [],
    switches: {},
    allBoxes: {},
    receipt: null,
  };
  static meta = {
    title: 'Generate receipts',
    description: 'About description',
  };
  componentWillMount() {
    this.props.dispatch(fetchVolunteers());
    this.props.dispatch(fetchForReceipt())
    .then(
    this.props.dispatch(fetchAllBoxes())
    .then((res) => convertObjtoArray(res))
    .then((res) => this.setState({
        allBoxes: res.slice(1),
      }))
      .then(()=> this.setState({
        //expandData: forReactCSV(this.state.allBoxes, this.props.receipt),
        expandData: expandDonationArray(this.state.allBoxes, this.props.receipt, this.props.posts),
      }))
    .catch(err => console.error('Error: ', err)));


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
    console.log(this.props);
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
                <th>수혜사</th>
                <th>기부물품</th>
                <th>가격</th>
                <th>수량</th>
                <th>총액</th>
                <th>멤버사</th>
              </tr>
              </thead>

              <tbody>
              {this.state.expandData &&
                this.state.expandData.map((data, idx) => (
                  <tr key={idx}>
                      <td>{data.npoName}</td>
                      <td>{data.name}</td>
                      <td>{data.price}</td>
                      <td>{data.quantitySum}</td>
                      <td>{data.totalSum}</td>
                      <td>{data.member}</td>
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
    posts: state.auth.posts,
    switches: state.posts.switches,
    allBoxes: state.posts.allBoxes,
    receipt: state.posts.receipt,
  };
}

export default connect(mapStateToProps)((withMeta(Receipt)));
