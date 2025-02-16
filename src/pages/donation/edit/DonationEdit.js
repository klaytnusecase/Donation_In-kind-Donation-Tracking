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
import { connect } from 'react-redux'

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';

import DatePicker from "react-datepicker";

import { fetchDetails, editDonation, doDonation } from '../../../actions/posts';
import s from './DonationEdit.scss';

class DonationEdit extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    details: PropTypes.array, // eslint-disable-line
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
  };

  static meta = {
    title: 'Edit donations',
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
      isModify: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    this.props.dispatch(fetchDetails(id)).then(() =>
      this.props.details.map((post) =>{
        switch(post.column_type) {
          case ('물품명'):
            this.setState({stuff_name: post.detail, nameispublic: post.is_public});
            break;
          case ('수량'):
            this.setState({quantity: post.detail, quantityispublic: post.is_public});
            break;
          case ('가격'):
            this.setState({price: post.detail, priceispublic: post.is_public});
            break;
          case ('유통기한'):
            this.setState({date: post.detail =='null' ? null : new Date(post.detail), priceispublic: post.is_public});
            break;
          default:
            this.setState({shareholders: this.state.shareholders.concat([{ column: post.column_type, value: post.detail, ispublic: post.is_public}])});
        }
      })).then(()=> {
        if (this.props.isNew == false){
          window.alert('잘못된 접근입니다');
          window.location.replace('/app');
        }
        if (this.props.orgType !== 'admin') {
          if (this.props.name !== this.props.details[0].company_id) {
            window.alert('잘못된 접근입니다');
            window.location.replace('/app');
          }
        }
    }
    );

  }

  handleChange(date) {
    this.setState({
      date,
      isModify: true
    });
  }
  changeStuffName = (event) => {
    this.setState({stuff_name: event.target.value,
      isModify: true});
  }
  changeQuantity = (event) => {
    this.setState({quantity: event.target.value,
      isModify: true});
  }
  changePrice = (event) => {
    this.setState({price: event.target.value,
      isModify: true});
  }
  changeNameIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({nameispublic: result,
      isModify: true});
  }
  changeQuantityIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({quantityispublic: result,
      isModify: true});
  }
  changePriceIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({priceispublic: result,
      isModify: true});
  };
  changeDateIsPublic = (event) => {
    let result;
    if (event.target.checked) result = true;
      else result = false;
    this.setState({dateispublic: result,
      isModify: true});
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
    this.setState({ shareholders: newShareholders,
      isModify: true });
  };

  handleShareholderValueChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, value: evt.target.value };
    });
    this.setState({ shareholders: newShareholders,
      isModify: true });
  };

  handleShareholderIspublicChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      let result;
      if (evt.target.checked) result = true;
      else result = false;
      return { ...shareholder, ispublic: result };
    });
    this.setState({ shareholders: newShareholders,
      isModify: true });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx),
      isModify: true
    });
  };

  doEditDonation = (e) => {
    this.props
      .dispatch(
        editDonation({
          old_id: this.props.match.params.id,
          company_id: this.props.name,
          stuff_name: this.state.stuff_name,
          nameispublic: this.state.nameispublic,
          quantity: this.state.quantity,
          quantityispublic: this.state.quantityispublic,
          price: this.state.price,
          priceispublic: this.state.priceispublic,
          date: !this.state.date ? null : this.state.date.yyyymmdd(),
          dateispublic: this.state.dateispublic,
          shareholders: this.state.shareholders,
          affiliation: this.props.details[0].affiliation,
          editor: this.props.affiliation
        }),
      )
      .then(res => this.props
        .dispatch(
          doDonation({
            donation_id: this.props.new_id,
            company_id: this.props.name,
          })
        ))
      .then(() =>
        window.location.replace(`/app/donation/${  this.props.new_id}`)
      );
    e.preventDefault();
  }

  render() {
    console.log(this.props);
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>기부내역 수정</BreadcrumbItem>
        </Breadcrumb>
        <h1>Edit Donation ID: {this.props.match.params.id}</h1>
        <Row>
          <Col sm={10}>
            <Widget
              title={
                <span>
                  <span className="fw-semi-bold">수정하고자 하는 물품의 정보를 입력해주세요.</span>
                </span>
              }
            >
             <br/>
              <Form onSubmit={this.doEditDonation}>
                {this.props.message && (
                  <Alert className="alert-sm" bsStyle="info">
                    {this.props.message}
                  </Alert>
                )}
                <FormGroup>
                  <Label for="input-title">기부물품 이름</Label>
                  <Input
                    id="input-title"
                    type="text"
                    placeholder="기부물품 이름"
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
                    <span>해당 속성을 공개하겠습니다.</span>
                </FormGroup>

                <FormGroup>
                  <Label for="input-title">수량 (개 단위로 입력해주세요)</Label>
                  <Input
                    id="input-title"
                    type="number"
                    placeholder="수량"
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
                    <span>해당 속성을 공개하겠습니다.</span>
                </FormGroup>

                <FormGroup>
                  <Label for="input-title">가격 (개당 원가를 입력해주세요)</Label>
                  <Input
                    id="input-title"
                    type="number"
                    placeholder="가격"
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
                    <span>해당 속성을 공개하겠습니다.</span>
                </FormGroup>
                <FormGroup>
                  <Label for="input-title">유통 기한 (없을 경우 비워주세요) </Label><br/>
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
                    <span>해당 속성을 공개하겠습니다.</span>
                </FormGroup>
                <hr/>
                {this.state.shareholders.map((shareholder, idx) => (
                  <React.Fragment key={`repetition${  idx}`}>
                  <FormGroup key = {`column${  idx}`}>
                    <Input
                      value= {shareholder.column}
                      onChange = {this.handleShareholderColumnChange(idx)}
                      type="text"
                      placeholder = "추가할 물품의 속성"
                      style={{ width:"50%" }}
                      />
                  </FormGroup>
                  <FormGroup key = {`detail${  idx}`}>
                    <Input
                      value= {shareholder.value}
                      onChange = {this.handleShareholderValueChange(idx)}
                      type="text"
                      required
                      placeholder = "해당 속성의 정보를 입력해주세요"
                      />
                  </FormGroup>
                    <FormGroup key = {`check${  idx}`}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input
                          checked = {shareholder.ispublic == true}
                          onClick = {this.handleShareholderIspublicChange(idx)}
                          type="checkbox"
                        />
                    <span>해당 속성을 공개하겠습니다.</span>
                    </FormGroup>
                    <Button
                    color="danger"
                    onClick={this.handleRemoveShareholder(idx)}
                    size="sm"
                    >
                      지우기
                    </Button>
                  <hr/>
                  </React.Fragment>
              ))}

              <Button
                color = "info"
                onClick={this.handleAddShareholder}
                size="sm"
              >
              속성 추가
              </Button>

                <div className="d-flex justify-content-end">
                  <ButtonGroup>
                    <Button color="success" type="submit" disabled={!this.state.isModify}>
                      {this.props.isFetching ? '수정중...' : '수정하기'}
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



// <td>{new Date(post.updatedAt).toLocaleString()}</td>

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    details: state.posts.details,
    name: state.auth.name,
    new_id: state.posts.new_id,
    isNew: state.posts.isNew,
    orgType: state.auth.org_type,
    affiliation: state.auth.affiliation,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(DonationEdit)));
