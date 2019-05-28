import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  ButtonGroup,
  Alert,
  Label,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';

import DatePicker from "react-datepicker";

import { createDonation } from '../../../actions/posts';
import s from './DonationNew.scss';
import {caver, centerAddress, contractAddress, centerPrivateKey} from '../../../caver';
const HappyAlliance = require('../../../../smart_contract/build/contracts/HappyAlliance.json');
const happyAlliance = new caver.klay.Contract(HappyAlliance.abi, contractAddress);


class DonationNew extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string,
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
  };

  static meta = {
    title: 'Register donation',
    description: 'About description',
  };

  constructor(props) {
    super(props);

    this.state = {
      company_id: '',
      stuff_name: '',
      nameispublic: false,
      quantity: 0,
      quantityispublic: false,
      price: 0,
      priceispublic: false,
      date: null,
      dateispublic: false,
      shareholders: [],
      donation_id: '',
      userKeystore: JSON.parse(require('../../../../keystore/'+this.props.klaytnAddress+'.txt')),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      userPrivateKey : caver.klay.accounts.decrypt(this.state.userKeystore, 'prisming'),
    });
  }
  handleChange(date) {
    this.setState({
      date
    });
  }
  changeStuffName = (event) => {
    this.setState({stuff_name: event.target.value});
  }
  changeQuantity = (event) => {
    this.setState({quantity: event.target.value});
  }
  changePrice = (event) => {
    this.setState({price: event.target.value});
  }
  changeNameIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({nameispublic: result});
  }
  changeQuantityIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({quantityispublic: result});
  }
  changePriceIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({priceispublic: result});
  };
  changeDateIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({dateispublic: result});
  }
  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([{ column: "", value: "", ispublic: false}])
    });
  };

  handleShareholderColumnChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, column: evt.target.value };
    });
    this.setState({ shareholders: newShareholders });
  };

  handleShareholderValueChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, value: evt.target.value };
    });
    this.setState({ shareholders: newShareholders });
  };

  handleShareholderIspublicChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      let result;
      if (evt.target.checked) result = true;
      else result = false;
      return { ...shareholder, ispublic: result };
    });
    this.setState({ shareholders: newShareholders });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    });
  };

  donate = (donation_id, company_id, info) => {
    const senderAddress = this.props.klaytnAddress;
    const { accessType, keystore, password, privateKey } = this.state.userPrivateKey;
    caver.klay.accounts.wallet.add(this.state.userPrivateKey);
    caver.klay.accounts.wallet.add(centerPrivateKey);

    let builder = happyAlliance.methods.donate(donation_id, company_id, info);
    let encodedBuilder = builder.encodeABI();
    let transactionObject = {
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: senderAddress,
        to: contractAddress,
        data: encodedBuilder,
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
        }
      });

    console.log('working');
  }

  doCreateDonation = (e) => {


    let info = {};
    if(this.state.nameispublic==true){
      info['stuff_name'] = this.state.stuff_name;
    };
    if(this.state.quantityispublic==true){
      info['quantity'] = this.state.quantity;
    };
    if(this.state.priceispublic==true){
      info['price'] = this.state.price;
    };
    if(this.state.dateispublic==true){
      info['date'] = this.state.date;
    };
    for(let i=0; i<this.state.shareholders.length; i++){
      let tmp = this.state.shareholders[i];
      if(tmp.ispublic==true){
        info[tmp.column] = tmp.value;
      }
    }

    this.props
      .dispatch(
        createDonation({
          company_id: this.props.name,
          affiliation: this.props.affiliation,
          stuff_name: this.state.stuff_name,
          nameispublic: this.state.nameispublic,
          quantity: this.state.quantity,
          quantityispublic: this.state.quantityispublic,
          price: this.state.price,
          priceispublic: this.state.priceispublic,
          date: !this.state.date ? null : this.state.date.yyyymmdd(),
          dateispublic: this.state.dateispublic,
          shareholders: this.state.shareholders,
        })
      )
      .then(res => this.donate(res.donation_id, this.props.name, JSON.stringify(info)))
          //this.doDonation()
          //doDonation({
          //  donation_id: res.donation_id,
          //  company_id: this.props.name,
          //  openInfo: JSON.stringify(info),
          //}))
        .then(() =>
          this.setState({
            company_id: '',
            stuff_name: '',
            nameispublic: false,
            quantity: 0,
            quantityispublic: false,
            price: 0,
            priceispublic:false,
            shareholders: [],
            date: null,
          }),
        );
    e.preventDefault();
  }

  render() {
    return (
      <div className={s.root}>
         <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>Register Donation</BreadcrumbItem>
        </Breadcrumb>
        <h1>기부 등록</h1>
        <Row>
          <Col sm={10}>
            <Widget
              title={
                <span>
                  <span className="fw-semi-bold">Fill the information of donations.</span>
                </span>
              }
            >
             <br/>
              <Form onSubmit={this.doCreateDonation}>
                {this.props.message && (
                  <Alert className="alert-sm" bsStyle="info">
                    {this.props.message}
                  </Alert>
                )}
                <FormGroup>
                  <Label for="input-title">Name</Label>
                  <Input
                    id="input-title"
                    type="text"
                    placeholder="Name"
                    value={this.state.stuff_name}
                    required
                    onChange={this.changeStuffName}
                  />
                </FormGroup>
                <FormGroup>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input
                          id="input-title"
                          checked = {this.state.nameispublic == true}
                          onClick = {this.changeNameIsPublic}
                          type="checkbox"
                        />
                    <span>Open this attribute to public.</span>
                </FormGroup>

                <FormGroup>
                  <Label for="input-title">Quantity</Label>
                  <Input
                    id="input-title"
                    type="number"
                    placeholder="Quantity"
                    value={this.state.quantity}
                    required
                    min = "0"
                    onChange={this.changeQuantity}
                  />
                </FormGroup>
                <FormGroup>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input
                          checked = {this.state.quantityispublic == true}
                          onClick = {this.changeQuantityIsPublic}
                          type="checkbox"
                        />
                    <span>Open this attribute to public.</span>
                </FormGroup>

                <FormGroup>
                  <Label for="input-title">Price per product</Label>
                  <Input
                    id="input-title"
                    type="number"
                    placeholder="Price per product"
                    value={this.state.price}
                    required
                    min = "0"
                    onChange={this.changePrice}
                  />
                </FormGroup>
                <FormGroup>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input
                          checked = {this.state.priceispublic == true}
                          onClick = {this.changePriceIsPublic}
                          type="checkbox"
                        />
                    <span>Open this attribute to public.</span>
                </FormGroup>
                <FormGroup>
                  <Label for="input-title">Expiration Date </Label><br/>
                  <DatePicker
                    selected={this.state.date}
                    onChange={this.handleChange}
                    dateFormat="yyyy/MM/dd"
                    minDate = {new Date()}
                  />
                </FormGroup>
                <FormGroup>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input
                          checked = {this.state.dateispublic == true}
                          onClick = {this.changeDateIsPublic}
                          type="checkbox"
                        />
                    <span>Open this attribute to public.</span>
                </FormGroup>
                <hr/>
                {this.state.shareholders.map((shareholder, idx) => (
                  <React.Fragment key={`repetition${  idx}`}>
                  <FormGroup key = {`column${  idx}`}>
                    <Input
                      value= {shareholder.column}
                      onChange = {this.handleShareholderColumnChange(idx)}
                      type="text"
                      placeholder = "Name of Attribute"
                      style={{ width:"50%" }}
                      />
                  </FormGroup>
                  <FormGroup key = {`detail${  idx}`}>
                    <Input
                      value= {shareholder.value}
                      onChange = {this.handleShareholderValueChange(idx)}
                      type="text"
                      required
                      placeholder = "Details"
                      />
                  </FormGroup>
                    <FormGroup key = {`check${  idx}`}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input
                          checked = {shareholder.ispublic == true}
                          onClick = {this.handleShareholderIspublicChange(idx)}
                          type="checkbox"
                        />
                    <span>Open this attribute to public.</span>
                    </FormGroup>
                    <Button
                    color="danger"
                    onClick={this.handleRemoveShareholder(idx)}
                    size="sm"
                    >
                      Remove
                    </Button>
                  <hr/>
                  </React.Fragment>
              ))}

              <Button
                color = "info"
                onClick={this.handleAddShareholder}
                size="sm"
              >
              Add Attribute
              </Button>

                <div className="d-flex justify-content-end">
                  <ButtonGroup>
                    <Button color="default">Cancel</Button>
                    <Button color="success" type="submit">
                      {this.props.isFetching ? 'Creating...' : 'Create'}
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
    name: state.auth.name,
    affiliation: state.auth.affiliation,
    klaytnAddress: state.auth.klaytnAddress,
  };
}

Date.prototype.yyyymmdd = function() {
  const mm = this.getMonth() + 1; // getMonth() is zero-based
  const dd = this.getDate();

  return [this.getFullYear(),'-',
          (mm>9 ? '' : '0') + mm,'-',
          (dd>9 ? '' : '0') + dd
         ].join('');
};

export default connect(mapStateToProps)(withStyles(s)(withMeta(DonationNew)));
