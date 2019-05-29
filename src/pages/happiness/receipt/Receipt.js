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
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchDonationsForHappiness, fetchAllBoxes } from '../../../actions/posts';
import { createCollection, fetchForReceipt } from '../../../actions/happiness';
import { fetchSwitch} from '../../../actions/configuration';
import {fetchVolunteers} from '../../../actions/user';
import { CSVLink, CSVDownload } from "react-csv";
import pdfMake from 'pdfmake/build/pdfmake';
//import vfsFonts from 'pdfmake/build/vfs_fonts';
import vfsFonts from '../../../../public/vfs_fonts';

const {vfs} = vfsFonts.pdfMake;
pdfMake.vfs = vfs;
pdfMake.fonts = {
   Nanum: {
     normal: 'NanumGothic.ttf',
     bold: 'NanumGothicBold.ttf',
     italics: 'NanumGothic.ttf',
     bolditalics: 'NanumGothic.ttf',
   },
 }

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

const _format = (data) => {
	return data.map(item => {
		return ([
			{text: item.name, alignment: 'center'},
			{text: item.quantitySum + " 개", alignment: 'center'},
			{text: item.totalSum + " 원", alignment: 'center'},
			{text: item.member + " 후원", alignment: 'center'},
		]);
	});
}
//pdfMake.createPdf(docDefinition).download('optionalName.pdf');


let headers = [
  { label: "멤버사", key: "member" },
  { label: "기부물품", key: "name" },
  { label: "수량", key: "quantitySum" },
  { label: "가격", key: "price" },
  { label: "총액", key: "totalSum" },
  { label: "수혜사", key: "npoName" },
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

  handleTargetMember = (event) => {
    this.setState({targetMember: event.target.value});
  }

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
      targetMember: '',
    }
  }

  searchMember = (e) => {
    let npoList = this.state.expandData.map(datum=>datum.npoName);
    let idx = getAllIndexes(npoList, this.state.targetMember);
    let selectedData = []
    for(let i=0;i<idx.length;i++){
      selectedData.push(this.state.expandData[idx[i]])
    }
    this.setState({selectedData: selectedData});
    e.preventDefault();
  }

  generateReceipt = (e) => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    const formattedData = _format(this.state.selectedData);
    const formattedData2 = _format(this.state.selectedData);

    const documentDefinition = {
  		pageSize: 'A4',
  		//pageOrientation: 'landscape',
  		content: [
  			{text: '수 령 증(센터보관용)', bold: true, alignment: 'center', fontSize:15},
  			'\n\n\n',
  			{
  				table: {
  					headerRows: 1,
            widths: [ 150, 50, 100, 150],
  					dontBreakRows: true,
  					body: [
  						[{text: '내용', style: 'tableHeader', alignment: 'center'}, {text: '수량', style: 'tableHeader', alignment: 'center'},
              {text: '금액', style: 'tableHeader', alignment: 'center'}, {text: '비고', style: 'tableHeader', alignment: 'center'}],
  						...formattedData,
  					]
  				},
  			},
        '\n\n',
        {text: '위 금액을 정히 영수함.'},
        '\n\n',
        {text: year+"년 "+month+"월 "+date+"일", alignment: 'center'},

        {text: '수 령 증(조합보관용)', bold: true, pageBreak:'before', alignment: 'center', fontSize:15},
        '\n\n\n',
  			{
  				table: {
  					headerRows: 1,
            widths: [ 150, 50, 100, 150],
  					dontBreakRows: true,
  					body: [
  						[{text: '내용', style: 'tableHeader', alignment: 'center'}, {text: '수량', style: 'tableHeader', alignment: 'center'},
              {text: '금액', style: 'tableHeader', alignment: 'center'}, {text: '비고', style: 'tableHeader', alignment: 'center'}],
  						...formattedData2,
  					]
  				},
  			},
        '\n\n',
        {text: '위 금액을 정히 영수함.'},
        '\n\n',
        {text: year+"년 "+month+"월 "+date+"일", alignment: 'center'},
  		],

      defaultStyle: {
        font: 'Nanum'
      }
    };

	   pdfMake.createPdf(documentDefinition).open();
  }


  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">Issue Receipt</li>
        </ol>

        <h1 className="page-title">Issue Receipt</h1>
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

        <Widget>
          <form onSubmit={this.searchMember}>
            <Input
                className="no-border"
                value={this.state.targetMember}
                onChange={this.handleTargetMember}
                type="select"
                required
                name="targetNPO"
              >
              <option value ='' disabled hidden>Member search</option>
              {this.state.expandData && [...new Set(this.state.expandData.map(datum => datum.npoName))].map(v=>(
                <option value={v} key={v}>{v}</option>
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

        <Widget>
          <div className="widget-table-overflow">
            <Table striped>
              <thead>
              <tr>
                <th>Member</th>
                <th>Items</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>NPO</th>
              </tr>
              </thead>

              <tbody>
              {this.state.selectedData &&
                this.state.selectedData.map((data, idx) => (
                  <tr key={idx}>
                      <td>{data.member}</td>
                      <td>{data.name}</td>
                      <td>{data.price}</td>
                      <td>{data.quantitySum}</td>
                      <td>{data.totalSum}</td>
                      <td>{data.npoName}</td>
                  </tr>
                  ))}

              </tbody>
            </Table>
          </div>
        </Widget>

        {this.state.selectedData &&
          <CSVLink data={this.state.selectedData} headers={headers}>선택 데이터 다운로드</CSVLink>}

        {this.state.selectedData &&
            <Button onClick={this.generateReceipt}>수령증 PDF 다운로드</Button>}
      </div>


    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.posts.message,
    affiliation: state.auth.affiliation,
    errorMessage: state.posts.errorMessage,
    posts: state.auth.posts,
    switches: state.posts.switches,
    allBoxes: state.posts.allBoxes,
    receipt: state.posts.receipt,
  };
}

export default connect(mapStateToProps)((withMeta(Receipt)));
