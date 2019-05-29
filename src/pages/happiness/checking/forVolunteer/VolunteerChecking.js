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
import axios from 'axios';
import {caver, centerAddress, contractAddress, centerPrivateKey, password} from '../../../../caver';
const HappyAlliance = require('../../../../../smart_contract/build/contracts/HappyAlliance.json');
const happyAlliance = new caver.klay.Contract(HappyAlliance.abi, contractAddress);


//Date.prototype.isDate = function (){
//    return !!((this !== "Invalid Date" && !isNaN(this)));
//}

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
    klaytnAddress: PropTypes.string,
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
    klaytnAddress: null,
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
      userKeystore: JSON.parse(require('../../../../../keystore/'+this.props.klaytnAddress+'.txt')),
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

    const senderAddress = this.props.klaytnAddress;
    const { accessType, keystore, password, privateKey } = this.state.userPrivateKey;
    caver.klay.accounts.wallet.add(this.state.userPrivateKey);
    caver.klay.accounts.wallet.add(centerPrivateKey);

    caver.klay.getTransactionCount(senderAddress).then(firstNonce => {
      for(let i=0; i<idxArray.length; i++){
        let val = idxArray[i];
        let builder = happyAlliance.methods.receiveBox(String(this.state.targetBoxes[val][0]), String(this.state.date));
        let encodedBuilder = builder.encodeABI();
        let transactionObject = {
            type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
            from: senderAddress,
            to: contractAddress,
            data: encodedBuilder,
            nonce: firstNonce+i,
            gas: 2000000,
        };
        caver.klay.accounts.signTransaction(transactionObject, privateKey, function (error, signedTx) {
            if (error) {
              console.log(error);
            } else {
              //KNOWN ISSUE: A sender must have at least 1 KLAY. (20190430)
              caver.klay.sendTransaction({
                feePayer: centerAddress,
                senderRawTransaction: signedTx.rawTransaction,
              })
              .on('receipt', (receipt) => console.log(receipt))
              .on('error', (error) => console.log(error));
          }});
          this.setState({
            percent: 100*(i+1)/idxArray.length,
          })
        }
    });


    this.props.dispatch(fetchNPOVolun(this.state.targetNPO));
    this.setState({
      confirmTarget: '',
      isClicked: true,
    });
    e.preventDefault();
  }

  updateBox = (e) => {
    const updateTargetIdx = getAllIndexes(this.props.npoBoxesForVolun[1], this.state.updateTarget);
    const emptyTargetIdx = getAllIndexes(this.props.npoBoxesForVolun[5], "");
    const intersectionIdx = updateTargetIdx.filter(value => emptyTargetIdx.includes(value));
    const updateBoxId = intersectionIdx.map(idx => this.props.npoBoxesForVolun[0][idx]);

    const senderAddress = this.props.klaytnAddress;
    const { accessType, keystore, password, privateKey } = this.state.userPrivateKey;
    caver.klay.accounts.wallet.add(this.state.userPrivateKey);
    caver.klay.accounts.wallet.add(centerPrivateKey);

    this.setState({percent: 0});

    caver.klay.getTransactionCount(senderAddress).then(firstNonce => {
      for(let i=0; i<this.state.number;i++){
        let builder = happyAlliance.methods.addInfo(
          updateBoxId[i], `${this.state.recipientA  }, ${  this.state.recipientB}`, String(this.state.recipient_date));
        let encodedBuilder = builder.encodeABI();
        let transactionObject = {
            type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
            from: senderAddress,
            to: contractAddress,
            data: encodedBuilder,
            nonce: firstNonce+i,
            gas: 20000000,
        };
        caver.klay.accounts.signTransaction(transactionObject, privateKey, function (error, signedTx) {
            if (error) {
              console.log(error);
            } else {
              //KNOWN ISSUE: A sender must have at least 1 KLAY. (20190430)
              caver.klay.sendTransaction({
                feePayer: centerAddress,
                senderRawTransaction: signedTx.rawTransaction,
              })
              .on('error', (error) => console.log(error))
              .on('receipt', (receipt) => console.log(receipt));
            }
        });
        this.setState({
          percent: 100*(i+1)/this.state.number,
        })
      }});

    this.props.dispatch(fetchNPOVolun(this.state.targetNPO));
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
    this.setState({
      userPrivateKey : caver.klay.accounts.decrypt(this.state.userKeystore, password),
    });
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
          <BreadcrumbItem active>Update Box Status</BreadcrumbItem>
        </Breadcrumb>
        <h1>Update Box Status</h1>
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
              <th>Type</th>
              <th>Total Quantity</th>
              <th>Remaining Boxes</th>

              <th>Items</th>
              <th>Date of Receipt by NPO</th>
              <th>Recipient Info</th>

              <th># of Delivered Boxes</th>
              <th>Date of Receipt by Recipient</th>
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
                    <td>{JSON.parse(this.props.npoBoxesForVolun[2][this.props.npoBoxesForVolun[1].indexOf(type)]).map(stuff => `${stuff.name} ${stuff.quantity} unit(s),`)}</td>
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
             <h2>Record a date when NPO receives boxes</h2>
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
                   placeholder="Box type"
                 >
                 <option value ='' disabled hidden>Box type</option>
                 {this.state.uniqueType &&
                   [...this.state.uniqueType].map(type => (
                     <option value={type} key={type}>{type}</option>
                   ))}
                 </Input>
               </FormGroup>

               <FormGroup>
                 <Label for="input-title">Date</Label><br/>
                 <DatePicker
                   selected={this.state.date}
                   onChange={this.handleChange}
                   required
                   //dateFormat="yyyy/MM/dd"
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
                <h5>Please refresh this page to check the updated information.</h5>

                <Modal isOpen={this.state.isOpen} toggle={this.toggleModal}>
                  <ModalHeader toggle={this.toggleModal}>
                    Do you record the date of receipt?
                  </ModalHeader>
                  <ModalBody />
                  <h5>&emsp; Progress</h5>
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
                    {(!this.state.isClicked) ? ('Update (Please wait until the progress reaches 100%)') : ((this.state.percent!==100) ? 'Saving... (Please wait)' : 'Completed')}
                  </Button>
                </Modal>
           </Widget>

       <Widget>
            <h2>Update Recipient Information</h2>
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
                  placeholder="Box type"
                >
                <option value ='' disabled hidden>Box type</option>
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
              placeholder="Quantity"
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
                  placeholder="Category A"
                >
                <option value ='' disabled hidden>Category A</option>
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
                  placeholder="Category B"
                >
                <option value ='' disabled hidden>Category B</option>
                {this.props.categoriesType2.map(cat => (
                    <option value={cat.category} key={cat.category}>{cat.category}</option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="input-title">Date of Receipt by Recipients</Label><br/>
                <DatePicker
                  selected={this.state.recipient_date}
                  onChange={this.handleRecipientChange}
                  dateFormat="yyyy/MM/dd"
                  required
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
               <h5>Please refresh this page to check the updated information.</h5>
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
    klaytnAddress: state.auth.klaytnAddress,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(VolunteerChecking)));
