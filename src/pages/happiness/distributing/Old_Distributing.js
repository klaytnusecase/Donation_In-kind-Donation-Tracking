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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { sendBox, fetchBlkchain, getNumBoxesByYear } from '../../../actions/posts';
import { fetchCollectionsAndDonations, updateRemainCollectionQuantity} from '../../../actions/happiness';

function pad_with_zeroes(number, length) {
    let my_string = `${  number}`;
    while (my_string.length < length) {
        my_string = `0${  my_string}`;
    }
    return my_string;
}


class Distributing extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string,
    isFetching: PropTypes.bool,
    donations: PropTypes.array,
    collections: PropTypes.array,
    volunteers: PropTypes.array,
    existingBoxes: PropTypes.any,
    boxcnt: PropTypes.any,
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    donations: [],
    collections: [],
    volunteers: [],
    existingBoxes: [],
    boxcnt: 0,
  };
  static meta = {
    title: 'Distribute new Donation Box',
    description: 'About description',
  };
  componentWillMount() {
    this.props.dispatch(fetchCollectionsAndDonations());
    this.props.dispatch(getNumBoxesByYear(new Date().getFullYear().toString()));
  }
  componentWillReceiveProps(nextProps){
    this.setState({
        donations : nextProps.donations,
        collections : nextProps.collections,
        volunteers: nextProps.volunteers
    });
  }
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.changeBackdrop = this.changeBackdrop.bind(this);
    this.state = {
      modal: false,
      quantity: 0,
      currentMax: 0,
      collections: [],
      volunteers: [],
      draggedCollection: {},
      selectedVolunteer: {}
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  changeBackdrop(e) {
    let value = e.target.value;
    if (value !== 'static') {
      value = JSON.parse(value);
    }
    this.setState({ backdrop: value });
  }

  onDrag = (event, collection) => {
    event.preventDefault();
    this.setState({
      draggedCollection: collection
    });
  };

  onDragOver = (event) => {
    event.preventDefault();
  };

  insertToVolunteer = (event, index) => {
    const {volunteers, draggedCollection } = this.state;
    const check = volunteers[index].inventory.find(o => o.id === draggedCollection.id);
    if (check == null){
      this.setState({
        currentMax: draggedCollection.remain_quantity,
        selectedVolunteer: volunteers[index]
      });
      this.toggle();
    }
    else{
      window.alert('이미 해당 단체에게 배정한 박스입니다.')
    }
  };

  saveChangeToVolunteer = () => {
    if (this.state.quantity > 0){
      const {collections, volunteers, draggedCollection, selectedVolunteer } = this.state;
      let check = true;
      const quantity = parseInt(this.state.quantity, 10);
      const newCollection = JSON.parse(JSON.stringify(draggedCollection));
      for (const i in collections){
       if (collections[i].id === draggedCollection.id) {
          if (collections[i].remain_quantity < quantity) check=false;
          else collections[i].remain_quantity -= quantity;
          break
        }
      }
      if (check === true){
        newCollection.remain_quantity = quantity;
        for (const i in volunteers)
          if (volunteers[i].username === selectedVolunteer.username) volunteers[i].inventory.push(newCollection);
          this.setState({
            currentMax: 0,
            quantity: 0,
            collections,
            volunteers,
            selectedVolunteer: {},
            draggedCollection: {},
        });
      }
      else{
        window.alert('너무 많습니다. 숫자를 확인해주세요')
      }
    }
    this.toggle()
  };
  removeFormInventory = (index_i, index_j) => evt => {
    const {collections, volunteers, draggedCollection, selectedVolunteer } = this.state;
    const target_id = volunteers[index_i].inventory[index_j].id;
    const quantity = volunteers[index_i].inventory[index_j].remain_quantity;
    const check = collections.find(o => o.id === target_id);
    check.remain_quantity += quantity;
    volunteers[index_i].inventory.splice(index_j, 1);
    this.setState({
            volunteers,
    });
  }

  handleQuantity = (event) => {
    this.setState({quantity: event.target.value});
  }

  handleinboxQuantity = idx => evt => {
    const newInBoxDonations = this.state.InBoxDonations.map((task, sidx) => {
      if (idx !== sidx) return task;
      return { ...task, inboxQuantity: evt.target.value };
    });
    this.setState({ InBoxDonations: newInBoxDonations });
  };

  doDistributeBoxes = (e) => {

    console.log(this.state.collections);
    this.props
      .dispatch(
        updateRemainCollectionQuantity({
          collections: this.state.collections
        }));
    const numVolun = this.state.volunteers.length;
    const d = new Date()
    const thisYear = String(d.getFullYear());
    let numExistingBoxes = Number(this.props.boxcnt) + 1;

    for (let i = 0; i < numVolun; i++) {
      for (let j = 0; j < this.state.volunteers[i].inventory.length; j++) {
        for (let k = 0; k < this.state.volunteers[i].inventory[j].remain_quantity; k++) {

          this.props
            .dispatch(
              sendBox({
                boxId: `${thisYear  }-${  pad_with_zeroes(numExistingBoxes, 7)}`, // year + 7 digit box id (0000001~9999999)
                serializedDonations: JSON.stringify(this.state.volunteers[i].inventory[j].donations),
                npo: String(this.state.volunteers[i].username),
                year: thisYear,
              }),
            )
            .then(() => this.setState({
                boxId: '',
                serializedDonations: '',
                npo: '',
                year: '',
              })
            );

          numExistingBoxes += 1;
        }
      }
    }
    // console.log(this.state.collections);
    // console.log(this.state.volunteers);
    window.confirm('상자를 분배하였습니다.');
    e.preventDefault();
  };


  render(){
    console.log(this.props);
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Donation Box</li>
          <li className="active breadcrumb-item">박스 나눠주기</li>
        </ol>

        <h1 className="page-title">박스 나눠주기</h1>
        <CardDeck>
          <Card>
            <Widget
              title={<h4> 현재 기부물품
              </h4>} close collapse
            >
              <hr/>
              <div
              style={{minHeight: "200px"}}>
                {
                  this.state.collections.map(collection =>
                    <div
                      key={collection.id}
                      draggable={collection.remain_quantity > 0}
                      onDrag={(event) => this.onDrag(event, collection)}
                      >
                      <span>
                      {collection.name}
                      </span>
                      <span style={{float:"right"}}>
                        총 남은 수량: {collection.remain_quantity}
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
              title={<h4> 박스 배정 상황
              </h4>} close collapse
            >
              <div key="scroll_area" style = {{height:'300px', overflowY: 'scroll'}}>
              {this.state.volunteers.map((volunteer, index_i)=>

                <div
                  key = {volunteer.username}
                  onDrop={event => this.insertToVolunteer (event, index_i)}
                  onDragOver={(event => this.onDragOver(event))}
                  style={{minHeight: "150px"}}
                >
                  <div key = {volunteer.name} style={{backgroundColor: 'lightblue'}}>
                    {volunteer.username}
                  </div>
                  {volunteer.inventory.map((collection_, index_j) =>
                      <div key = {volunteer.name, collection_.name}>
                        <span>
                          {collection_.name}
                        </span>
                        <span style={{float:"right"}}>
                          총 남은 수량: {collection_.remain_quantity}
                          <Button type="button" className="close" ari-label="Close" onClick={this.removeFormInventory(index_i, index_j)}>
                           <span aria-hidden="true">&times;</span>
                          </Button>
                        </span>
                      </div>
                  )}
                </div>
              )}
                </div>
            </Widget>
          </Card>
        </CardDeck>
            <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
              <ButtonGroup>
              <Button color="success" onClick={this.doDistributeBoxes}>
                {this.props.isFetching ? 'Creating...' : 'Create'}
              </Button>
              </ButtonGroup>
            </div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop={this.state.backdrop}>
          <ModalHeader toggle={this.toggle}>
            수량 입력하기
          </ModalHeader>
          <ModalBody>
            해당 기관에 보내실 수량을 입력해주세요
            <Input
              value = {this.state.quantity}
              onChange = {this.handleQuantity}
              required
              type="number"
              min = "0"
              max = {this.state.currentMax}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={this.saveChangeToVolunteer}>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.posts.message,
    donations: state.posts.donations,
    collections: state.posts.collections,
    volunteers: state.posts.volunteers,
    existingBoxes: state.posts.existingBoxes,
    boxcnt: state.posts.boxcnt,
  };
}


export default connect(mapStateToProps)((withMeta(Distributing)));
