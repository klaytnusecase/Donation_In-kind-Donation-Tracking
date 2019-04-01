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
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchDonationsForHappiness } from '../../../actions/posts';
import { createCollection} from '../../../actions/happiness';
import { fetchSwitch} from '../../../actions/configuration';

class Planning extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string,
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool,
    posts: PropTypes.array,
    switches: PropTypes.object,
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
    posts: [],
    switches: {},
  };
  static meta = {
    title: 'Create new happiness box',
    description: 'About description',
  };
  componentWillMount() {
    this.props.dispatch(fetchDonationsForHappiness()).then(()=>
     this.setState({
        donations: this.props.posts,
      })
    );
    this.props.dispatch(fetchSwitch()).then(()=> {
      if (this.props.switches.switch_3 === true) {
        window.alert('이미 최종배분이 완료 되었습니다');
        window.location.replace('/app');
      }
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      donations: this.props.posts,
      InBoxDonations: [],
      draggedDonation: {},
      expirationDate: [],
    }
  }
  onDrag = (event, donation) => {
    event.preventDefault();
    this.setState({
      draggedDonation: donation
    });
  };
  onDragOver = (event) => {
    event.preventDefault();

  };
  insertToCollection = (event) => {
    const { InBoxDonations, draggedDonation, donations } = this.state;
    const check = InBoxDonations.find(o => o.donation_id === draggedDonation.donation_id);
    if (check == null){
      this.setState({
      InBoxDonations: [...InBoxDonations, draggedDonation],
      donations: donations.filter(task => task.donation_id !== draggedDonation.donation_id),
      draggedDonation: {},
      expirationDate: [...InBoxDonations, draggedDonation].map(donation => {
        if(donation.유통기한==="null"){
          return null
        }
        
          return new Date(donation.유통기한)
        
      }).filter((obj)=>obj),
    });
    }
  };


    removeFormCollection = (event ) => {
    const { InBoxDonations, draggedDonation, donations } = this.state;
    const check = donations.find(o => o.donation_id === draggedDonation.donation_id);
    if (check == null){
         this.setState({
      InBoxDonations: InBoxDonations.filter(task => task.donation_id !== draggedDonation.donation_id),
      donations: [...donations, draggedDonation],
      draggedDonation: {},
    });
    }
  };
  handleName = (event) => {
    this.setState({name: event.target.value});
  }

  handleinboxQuantity = idx => evt => {
    const newInBoxDonations = this.state.InBoxDonations.map((task, sidx) => {
      if (idx !== sidx) return task;
      return { ...task, inboxQuantity: evt.target.value };
    });
    this.setState({ InBoxDonations: newInBoxDonations });
  };

  doCreateCollection = (e) => {
    this.props
      .dispatch(
        createCollection({
          name: this.state.name,
          InBoxDonations: this.state.InBoxDonations,
          expirationDate: this.state.expirationDate,
        }),
      ).then(() =>
        this.setState({
          InBoxDonations: [],
          draggedDonation: {},
          expirationDate: [],
          name:''
        }),
      );

    e.preventDefault();
  };


  render() {
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">박스 기획하기</li>
        </ol>

        <h1 className="page-title">박스 기획하기</h1>
        <form onSubmit={this.doCreateCollection}>
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
         <CardDeck style={{marginBottom: '10px'}}>
          <Card>
            <Input
              value = {this.state.name}
              placeholder = '이름을 입력해주세요'
              onChange = {this.handleName}
              required
              type="text"
            />
          </Card>
         </CardDeck>
        <CardDeck>
          <Card>
            <Widget
              title={<h4> 현재 기부물품
              </h4>} close collapse
            >
              <hr/>
              <div
              onDrop={event => this.removeFormCollection (event)}
              onDragOver={(event => this.onDragOver(event))}
              style={{minHeight: "200px"}}>
                {
                  this.state.donations.map(donation =>
                    <div
                      key={donation.donation_id}
                      draggable
                      onDrag={(event) => this.onDrag(event, donation)}
                      >
                      <span>
                      {donation.물품명} &emsp; (유통기한: {donation.유통기한!=="null" ? donation.유통기한 : "데이터 없음"})
                      </span>
                      <span style={{float:"right"}}>
                        총 수량: {donation.수량}
                      </span>
                      <hr/>
                    </div>
                  )
                }
              </div>
            </Widget>
          </Card>
          <Card>
            <Widget
              title={<h4> 박스 구성</h4>} close collapse
            >
              <hr/>
              <div
                onDrop={event => this.insertToCollection (event)}
                onDragOver={(event => this.onDragOver(event))}
                 style={{minHeight: "200px"}}>
                 <h5><span>{(this.state.expirationDate.length>0) ?
                   new Date(Math.min.apply(null, this.state.expirationDate)).toISOString().substring(0, 10)  : "미지정"}</span></h5>

                {this.state.InBoxDonations.map((donation, index) =>
                  <div
                    key={donation.donation_id}
                    draggable
                    onDrag={(event) => this.onDrag(event, donation)}
                  >
                    <span>
                      {donation.물품명} &emsp; (유통기한: {donation.유통기한!=="null" ? donation.유통기한 : "데이터 없음"})
                      </span>
                      <span style={{float:"right"}}>
                        총 수량: {donation.수량}
                      </span>
                    <span>
                    <Input
                      value = {donation.inboxQuantity}
                      onChange = {this.handleinboxQuantity(index)}
                      required
                      type="number"
                      min = "0"
                      style={{ display:"flex"}}
                      />
                    </span>
                    <hr/>
                  </div>
                  // {this.state.InBoxDonations[0].유통기한 && this.state.InBoxDonations.reduce((min, p) => p.유통기한 < min ? p.유통기한 : min, this.state.InBoxDonations[0].유통기한)}
                )}

              </div>
            </Widget>
          </Card>
        </CardDeck>
            <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
              <ButtonGroup>
              <Button color="success" type="submit">
                {this.props.isFetching ? '생성중...' : '컬랙션 생성'}
              </Button>
              </ButtonGroup>
            </div>
        </form>
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
    switches: state.posts.switches
  };
}

export default connect(mapStateToProps)((withMeta(Planning)));
