import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";

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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Alert,
} from 'reactstrap';

import DatePicker from "react-datepicker";
import s from './../Checking.scss';
import withMeta from '../../../../core/withMeta';
import Widget from '../../../../components/Widget';
import { fetchPosts, fetchDonations, fetchBlkchain, fetchBoxDetails, updateBox, fetchNPOVolun, confirmBox} from '../../../../actions/posts';
import {fetchCollectionsAndDonations} from '../../../../actions/happiness';
import { fetchRecipientCategory } from '../../../../actions/configuration';
import CircularProgressbar from 'react-circular-progressbar';

Date.prototype.isDate = function (){
    return !!((this !== "Invalid Date" && !isNaN(this)));
}

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
function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}
function convertDate(date){
  const d = new Date(date)
  if(d instanceof Date && !isNaN(d.valueOf())){
    const isoDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
    return isoDate;
  }

    return '';


}



class VolunteerChecking extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isFetching: PropTypes.bool,
    existingBoxes: PropTypes.array,
    volunteers: PropTypes.array,
    info: PropTypes.object,
    npoBoxesForVolun: PropTypes.object,
    categories: PropTypes.array,
    categoriesType1: PropTypes.array,
    categoriesType2: PropTypes.array,
  };

  static defaultProps = {
    isFetching: false,
    existingBoxes: [],
    info: {0: '', 1: '', 2: ''},
    volunteers: [],
    npoBoxesForVolun: {0:''},
    categories: [{ category: ""}],
    categoriesType1: [{ category: ""}],
    categoriesType2: [{ category: ""}],
    isOpen: false,
  };

  static meta = {
    title: 'Posts list',
    description: 'About description',
  };

  toggleModal = () => {
     this.setState({
       isOpen: !this.state.isOpen
     });
   }

  handleNumber = (event) => {
    this.setState({number: event.target.value});
  }
  handleBoxId = (event) => {
    this.setState({boxId: event.target.value});
  }
  handleTargetNPO = (event) => {
    this.setState({targetNPO: event.target.value});
  }
  handleRecipientA = (event) => {
    this.setState({recipientA: event.target.value});
  }
  handleRecipientB = (event) => {
    this.setState({recipientB: event.target.value});
  }
  handleTarget = (event) => {
    this.setState({updateTarget: event.target.value});
  }
  handleConfirmTarget = (event) => {
    this.setState({confirmTarget: event.target.value});
  }

  constructor(props) {
    super(props);
    this.state = {
      boxId: '',
      recipientA: '',
      recipientB: '',
      updateTarget: '',
      confirmTarget:'',
      stuffs: '',
      targetNPO: this.props.name,
      targetBoxes: [],
      date: null,
      recipient_date: null,
      uniqueType: [],
      number: '',
      uniqueDate: [],
      percent: 0,
      isClicked: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
  }
  handleChange(date) {
    this.setState({
      date
    });
  }

  handleRecipientChange(recipient_date) {
    this.setState({
      recipient_date
    });
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
        fetchNPOVolun(this.state.targetNPO),
      )
    .then((res) => this.setState({
        targetBoxes: convertObjtoArray(res),
      }))
      .then(()=> this.setState({
        uniqueType: new Set(this.state.targetBoxes.map(box=>box[1])),
        uniqueDate: new Set(this.state.targetBoxes.map(box=>box[5])),
      }))
    .catch(err => console.error('Error: ', err));
    e.preventDefault();
  }

  doConfirmBox = (e) => {
    const allTypes = this.state.targetBoxes.map(box=>box[1]);
    const idxArray = getAllIndexes(allTypes, this.state.confirmTarget);
    idxArray.map((val, idx) => this.props.dispatch(confirmBox({
      boxId: String(this.state.targetBoxes[val][0]),
      receivedTime: String(this.state.date),
    }))
    .then(this.setState({
      percent: Math.ceil(100*(idx+1)/idxArray.length),
    }))
  .then(() => this.props.dispatch(fetchNPOVolun(this.state.targetNPO))));
  this.setState({
      date: null,
      confirmTarget: '',
      isClicked: true,
    });
    e.preventDefault();
  }

  updateBox = (e) => {
    const updateTargetIdx = getAllIndexes(this.props.npoBoxesForVolun[1], this.state.updateTarget);
    const emptyTargetIdx = getAllIndexes(this.props.npoBoxesForVolun[5], "");
    const unionIdx = updateTargetIdx.filter(value => emptyTargetIdx.includes(value))

    const updateBoxId = unionIdx.map(idx => this.props.npoBoxesForVolun[0][idx]);
    Array(...{length: this.state.number}).map(Number.call, Number).forEach(i =>
      this.props.dispatch(
        updateBox({
          updateTarget: updateBoxId[i],
          recipient: `${this.state.recipientA  }, ${  this.state.recipientB}`,
          recipientDate: String(this.state.recipient_date),
        }))
        .then(()=> this.setState({
          updateTarget: '',
          recipientA: '',
          recipientB: '',
          recipient_date: null,
          number: '',
        })));
    e.preventDefault();
  }

  componentWillMount() {
    this.props
    .dispatch(
        fetchNPOVolun(this.state.targetNPO),
      )
    .then((res) => this.setState({
        targetBoxes: convertObjtoArray(res),
      }))
      .then(()=> this.setState({
        uniqueType: new Set(this.state.targetBoxes.map(box=>box[1])),
        uniqueDate: new Set(this.state.targetBoxes.map(box=>box[5])),
      }))
    .catch(err => console.error('Error: ', err));
    this.props.dispatch(fetchCollectionsAndDonations());
    this.props.dispatch(fetchRecipientCategory());
  }

  render() {
    console.log(this.props);
    console.log(this.state);
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

        <Widget>
          <div className="widget-table-overflow">
            <Table striped>
            <thead>
            <tr>
              <th>상자종류</th>
              <th>총 개수</th>
              <th>남은 상자 수</th>

              <th>상자구성</th>
              <th>수혜사 수령 일자</th>
              <th>수혜대상 정보</th>

              <th>전달한 개수</th>
              <th>수혜대상 수령 일자</th>
            </tr>
            </thead>
            <tbody>
            {this.state.uniqueType &&
              [...this.state.uniqueType].map(type =>
                [...new Set(getAllIndexes(this.props.npoBoxesForVolun[1], type).map(idx => this.props.npoBoxesForVolun[4][idx]))]
                .map(cat =>
                  <tr key={type + cat}>
                    <td>{type}</td>
                    <td>{getAllIndexes(this.props.npoBoxesForVolun[1], type).length}</td>
                    <td>{getAllIndexes(getAllIndexes(this.props.npoBoxesForVolun[1], type).map(idx => this.props.npoBoxesForVolun[5][idx]), "").length}</td>
                    <td>{JSON.parse(this.props.npoBoxesForVolun[2][this.props.npoBoxesForVolun[1].indexOf(type)]).map(stuff => `${stuff.name} ${stuff.quantity}개,`)}</td>
                    <td>{(this.props.npoBoxesForVolun[3][getAllIndexes(this.props.npoBoxesForVolun[1], type)[0]]!=="") ? convertDate(this.props.npoBoxesForVolun[3][getAllIndexes(this.props.npoBoxesForVolun[1], type)[0]]) : ''}</td>
                    <td>{cat}</td>
                    <td>{(getAllIndexes(getAllIndexes(this.props.npoBoxesForVolun[1], type).map(idx => this.props.npoBoxesForVolun[4][idx]), cat).length!==0) && (cat!=="") ?
                    getAllIndexes(getAllIndexes(this.props.npoBoxesForVolun[1], type).map(idx => this.props.npoBoxesForVolun[4][idx]), cat).length : 0}</td>
                    <td>{convertDate(this.props.npoBoxesForVolun[5][getAllIndexes(this.props.npoBoxesForVolun[1], type).filter(value=>getAllIndexes(this.props.npoBoxesForVolun[4], cat).includes(value))[0]])}</td>
                  </tr>
                ))}
                {this.props.isFetching && (
                  <tr>
                    <td colSpan="100">Loading...</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Widget>

        <Widget>
             <h2>수령 여부 업데이트</h2>
               {this.props.errorMessage && (
                 <Alert size="sm" color="danger">
                   {this.props.errorMessage}
                 </Alert>
               )}

               <FormGroup className="form-group">
                 <Input
                   className="no-border"
                   value={this.state.confirmTarget}
                   onChange={this.handleConfirmTarget}
                   type="select"
                   required
                   name="confirm"
                   placeholder="수령할 상자 종류"
                 >
                 <option value ='' disabled hidden>수령할 상자 종류</option>
                 {this.state.uniqueType &&
                   [...this.state.uniqueType].map(type => (
                     <option value={type} key={type}>{type}</option>
                   ))}
                 </Input>
               </FormGroup>

               <FormGroup>
                 <Label for="input-title">수령 시점</Label><br/>
                 <DatePicker
                   selected={this.state.date}
                   onChange={this.handleChange}
                   required
                   dateFormat="yyyy/MM/dd"
                   minDate = {new Date('2019-01-01T00:00:00')}
                   maxDate = {new Date()}
                 />
               </FormGroup>


               <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
                 <ButtonGroup>
                 <Button color="success" type="submit" onClick={this.toggleModal}>
                   {'Submit'}
                 </Button>
                 </ButtonGroup>
                </div>

                <Modal isOpen={this.state.isOpen} toggle={this.toggleModal}>
                  <ModalHeader toggle={this.toggleModal}>
                    수령 시점을 등록하시겠습니까?
                  </ModalHeader>
                  <ModalBody />
                  <h5>&emsp; 블록체인 등록 진행 상황</h5>
                  <div style={{ width: '80%' }}>
                    <CircularProgressbar
                      percentage={this.state.percent}
                      text={`${this.state.percent}%`}
                      background
                      backgroundPadding={6}
                      styles={{
                        background: {
                          fill: '#fff',
                        },
                        text: {
                          fill: '#3e98c7',
                          fontSize: '10px',
                        },
                        path: {
                          stroke: '#3e98c7',
                        },
                        trail: { stroke: 'transparent' },
                      }}
                    />
                  </div>
                  <Button color={(!this.state.isClicked) ? "danger" : ((this.state.percent!==100)? "info" : "success")} variant="primary"
                  onClick={(!this.state.isClicked) ? this.doConfirmBox : this.toggleModal}>
                    {(!this.state.isClicked) ? ('등록하기 (클릭 후 원이 완전히 찰때까지 기다려주세요)') : ((this.state.percent!==100) ? '등록 중... (원이 완전히 찰때까지 기다려주세요)' : '등록완료')}
                  </Button>
                </Modal>
           </Widget>

       <Widget>
            <h2>수혜자 정보 업데이트</h2>
            <Form onSubmit={this.updateBox}>
              {this.props.errorMessage && (
                <Alert size="sm" color="danger">
                  {this.props.errorMessage}
                </Alert>
              )}

              <FormGroup className="form-group">
                <Input
                  className="no-border"
                  value={this.state.updateTarget}
                  onChange={this.handleTarget}
                  type="select"
                  required
                  name="confirm"
                  placeholder="수혜자 정보를 입력할 상자 종류"
                >
                <option value ='' disabled hidden>수령할 정보를 입력할 상자 종류</option>
                {this.state.uniqueType &&
                  [...this.state.uniqueType].map(type => (
                    <option value={type} key={type}>{type}</option>
                  ))}
                </Input>
              </FormGroup>

              <Input
              value = {this.state.number}
              onChange = {this.handleNumber}
              type="number"
              min = "0"
              max = {this.state.updateTarget ? getAllIndexes(getAllIndexes(this.props.npoBoxesForVolun[1], this.state.updateTarget).map(idx => this.props.npoBoxesForVolun[5][idx]), "").length : 0}
              style={{ display:"flex"}}
              placeholder="개수"
              />
              <hr/>

              <FormGroup className="form-group">
                <Input
                  className="no-border"
                  value={this.state.recipientA}
                  onChange={this.handleRecipientA}
                  type="select"
                  required
                  name="categories"
                  placeholder="수혜자 카테고리 A"
                >
                <option value ='' disabled hidden>수혜자 카테고리 A</option>
                {this.props.categoriesType1.map(cat => (
                    <option value={cat.category} key={cat.category}>{cat.category}</option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup className="form-group">
                <Input
                  className="no-border"
                  value={this.state.recipientB}
                  onChange={this.handleRecipientB}
                  type="select"
                  required
                  name="categories"
                  placeholder="수혜자 카테고리 B"
                >
                <option value ='' disabled hidden>수혜자 카테고리 B</option>
                {this.props.categoriesType2.map(cat => (
                    <option value={cat.category} key={cat.category}>{cat.category}</option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="input-title">수혜 시점</Label><br/>
                <DatePicker
                  selected={this.state.recipient_date}
                  onChange={this.handleRecipientChange}
                  dateFormat="yyyy/MM/dd"
                  minDate = {new Date('2019-01-01T00:00:00')}
                  maxDate = {new Date()}
                />
              </FormGroup>


              <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
                <ButtonGroup>
                <Button color="success" type="submit" disabled={this.props.npoBoxesForVolun[1] ? (this.props.npoBoxesForVolun[3][this.props.npoBoxesForVolun[1].indexOf(this.state.updateTarget)]==="") : true}>
                  {'Submit'}
                </Button>
                </ButtonGroup>
               </div>
            </Form>
          </Widget>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.posts.message,
    existingBoxes: state.posts.existingBoxes,
    info: state.posts.info,
    volunteers: state.posts.volunteers,
    npoBoxesForVolun: state.posts.npoBoxesForVolun,
    orgType: state.auth.org_type,
    name: state.auth.name,
    categoriesType1: state.posts.categoriesType1,
    categoriesType2: state.posts.categoriesType2,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(VolunteerChecking)));
