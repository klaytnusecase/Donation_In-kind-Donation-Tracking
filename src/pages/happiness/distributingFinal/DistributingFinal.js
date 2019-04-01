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
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from 'reactstrap';
import { connect } from 'react-redux';
import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchCollectionsDistribution, updateCollectionDistribution, fetchCollectionsAndDonations} from '../../../actions/happiness';
import { sendBox, getNumBoxesByYear } from '../../../actions/posts';
import { fetchSwitch} from '../../../actions/configuration';
import CircularProgressbar from 'react-circular-progressbar';


function pad_with_zeroes(number, length) {
    let my_string = `${  number}`;
    while (my_string.length < length) {
        my_string = `0${  my_string}`;
    }
    return my_string;
}
// give percent any shape you want

class Distributing extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string,
    switches: PropTypes.object,
    isFetching: PropTypes.bool,
    quantities: PropTypes.array,
    collections: PropTypes.array,
    volunteers: PropTypes.array,
    boxcnt: PropTypes.any,
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    quantities: [],
    collections: [],
    volunteers: [],
    boxcnt: 0,
    switches: {},
  };
  static meta = {
    title: 'Distribute new happiness box',
    description: 'About description',
  };
  componentWillMount() {
    this.props.dispatch(fetchCollectionsDistribution());
    this.props.dispatch(fetchCollectionsAndDonations());
    this.props.dispatch(fetchSwitch()).then(()=> {
      if (this.props.switches.switch_3 === true) {
        window.alert('이미 최종배분이 완료 되었습니다');
        window.location.replace('/app');
      }
    });
    // this.props.dispatch(getNumBoxesByYear(new Date().getFullYear().toString()));
  }
  componentWillReceiveProps(nextProps){
    this.setState({
        collections : nextProps.collections,
        volunteers: nextProps.volunteers,
        quantities: nextProps.quantities
    }, () => {
      const SummationArray = Array(this.state.collections.length).fill(0)
      for (let i=0; i<this.state.volunteers.length;i++){
        for (let j=0; j<this.state.collections.length;j++){
          SummationArray[j] += this.state.quantities[i][j]
        }
      }

      const limitArray = Array(this.state.collections.length).fill(0)
      for (let i=0; i<this.state.collections.length;i++)
        limitArray[i] = this.state.collections[i].quantity;

      const collection_id_list = []
      for (const i in this.state.collections)
        collection_id_list.push(this.state.collections[i].id)

      const volunteers_name_list = []
      for (const i in this.state.volunteers)
        volunteers_name_list.push(this.state.volunteers[i].username)

      const volunteers_affiliation_list = []
      for (const i in this.state.volunteers)
        volunteers_affiliation_list.push(this.state.volunteers[i].affiliation)


      this.setState({
        total: SummationArray,
        limit: limitArray,
        collection_ids: collection_id_list,
        volunteer_names: volunteers_name_list,
        collectionsForMaking : nextProps.collectionsForMaking,
        volunteer_affiliations: volunteers_affiliation_list,
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      volunteers: [],
      quantities: [],
      total: [],
      limit: [],
      collection_ids: [],
      volunteer_names: [],
      volunteer_affiliations: [],
      isOpen: false,
      isClicked: false,
      percent: 0,
      blockHash: [],
    };
  }

toggleModal = () => {
   this.setState({
     isOpen: !this.state.isOpen
   });
 }

  doFinalDistribute = (e) => {
    const d = new Date()
    const thisYear = String(d.getFullYear());
    let numExistingBoxes = Number(this.props.boxcnt)+1;
    this.setState({
      isClicked: true,
    });

    this.props
      .dispatch(
        updateCollectionDistribution({
          collection_ids: this.state.collection_ids,
          volunteer_names: this.state.volunteer_names,
          quantities: this.state.quantities,
        }),
      ).then(
        this.props.dispatch(fetchCollectionsDistribution()))
        .then(this.state.volunteer_names.map((val, idx) =>
        this.state.quantities[idx].map((q, idx2) =>
          Array(...{length: q}).map(Number.call, Number).forEach(() =>
            this.props.dispatch(
              sendBox({
                boxId: `${thisYear  }-${  pad_with_zeroes(numExistingBoxes++, 7)}`, // year + 7 digit box id (0000001~9999999)
                serializedDonations: JSON.stringify(this.state.collectionsForMaking[idx2].donations),
                npo: val,
                year: thisYear,
                expirationDate: this.state.collections[idx2].expiration_date,
                boxType: this.state.collections[idx2].name,
              })
            )
            .then(res => setTimeout(()=>this.state.blockHash.push(res.blockHash), 100))
            .then(() => setTimeout(() => this.setState({
              percent: Math.ceil(100*this.state.blockHash.length/this.state.total.reduce((a,b) => a+b, 0))
            }), 100))
          ))));


    // window.confirm('상자를 분배하였습니다.');
    // this.toggleModal();
    e.preventDefault();
  };

  render(){
    console.log(this.state);
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">박스 분배 수량 정하기</li>
        </ol>

        <h1 className="page-title">박스 분배 수량 정하기</h1>
        <CardDeck>
          <Card>
            <Widget>
              <Table bordered>
                <thead>
                  <tr>
                    <th key="dummy">#</th>
                    {
                      this.state.collections && this.state.collections.map(collection =>
                        <th key={collection.id}>
                          {collection.name} &emsp; (유통기한: {(JSON.parse(collection.expiration_date).length>0) ? new Date(Math.min.apply(null, JSON.parse(collection.expiration_date).map(date => new Date(date)))).toISOString().substring(0, 10) : "없음"})
                        </th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.quantities.map((quantity_row, index_i) =>
                      <tr key={index_i}>
                        <th>{this.state.volunteer_affiliations[index_i]}
                        </th>
                        {
                          quantity_row.map((quantity, index_j) =>
                           <th key={index_j}>
                            <Input
                              id="input-title"
                              type="number"
                              pattern='[0-9]{0,5}'
                              value={quantity}
                              required
                              disabled
                              min = "0"
                            />
                          </th>)
                        }
                      </tr>
                      )
                  }
                  <tr>
                    <th>Total</th>
                    {
                      this.state.total && this.state.total.map((value,index_i) =>
                        <th key={`total${ index_i}`}>
                          {value}/{this.state.limit[index_i]}
                        </th>
                      )
                    }
                  </tr>
                </tbody>
              </Table>
            </Widget>
          </Card>
        </CardDeck>

        <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
          <ButtonGroup>
          <Button color="danger" onClick={this.toggleModal}>
            {'분배확정'}
          </Button>
          </ButtonGroup>
        </div>

        <Modal isOpen={this.state.isOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h5>상자를 분배하시겠습니까? 되돌릴 수 없습니다.</h5>
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
          onClick={(!this.state.isClicked) ? this.doFinalDistribute : this.toggleModal}>
            {(!this.state.isClicked) ? ('분배하기 (클릭 후 원이 완전히 찰때까지 기다려주세요)') : ((this.state.percent!==100) ? '분배 중... (원이 완전히 찰때까지 기다려주세요)' : '분배완료')}
          </Button>
        </Modal>

      </div>
    );
  }
}

// this.state.total.reduce((a,b) => a+b, 0)

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.posts.message,
    quantities: state.posts.quantities,
    collections: state.posts.collections,
    volunteers: state.posts.volunteers,
    collectionsForMaking: state.posts.collectionsForMaking,
    switches: state.posts.switches
  };
}


export default connect(mapStateToProps)((withMeta(Distributing)));
