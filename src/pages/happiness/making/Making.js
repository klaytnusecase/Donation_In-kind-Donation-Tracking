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
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardHeader,
  CardColumns,
  CardFooter,
  Card,
  Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import withMeta from '../../../core/withMeta';
import { fetchCollectionsAndDonations, setCollectionQuantity, removeCollection } from '../../../actions/happiness';
import { fetchSwitch} from '../../../actions/configuration';

class Making extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string,
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool,
    donations: PropTypes.array,
    switches: PropTypes.object,
    collectionsForMaking: PropTypes.array
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
    donations: [],
    switches: {},
    collectionsForMaking: [],
  };
  static meta = {
    title: 'Create new happiness box',
    description: 'About description',
  };
  componentWillMount() {
    this.props.dispatch(fetchCollectionsAndDonations()).then(()=>
    this.setState({
        donations : this.props.donations,
        collections : this.props.collectionsForMaking
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
      name: [],
      donations: [],
      collections: [],
      feasibility: false,
    }
  }

  handleQuantity = idx => evt => {
    const newCollections = this.state.collections.map((collection, sidx) => {
      if (idx !== sidx) return collection;
      return { ...collection, collection_quantity: evt.target.value };
    });
    this.setState({ collections: newCollections, feasibility: false});
  };
  checkFeasibility= (e) => {
    let check = true;
    const collections = this.state.collections;
    const defaultDict = new Proxy({}, {
    get: (target, name) => name in target ? target[name] : 0
    });
    for (const i in collections){
      if (collections[i].collection_quantity > 0){
        for (const j in collections[i].donations) {
          const donation_id = collections[i].donations[j].donation_id;
          const quantity = collections[i].donations[j].quantity;
          defaultDict[donation_id] += collections[i].collection_quantity * quantity;
        }
      }
    }
    const donations = this.state.donations;
    for (const i in donations){
      if (parseInt(donations[i].수량, 10) < defaultDict[donations[i].donation_id]){
        check = false
      }
    }
    window.confirm('정합성 체크가 완료 되었습니다.')
    this.setState({feasibility: check});
  };

  doSetQuantity = (e) => {
    this.props
      .dispatch(
        setCollectionQuantity({
          collections: this.state.collections
        }),
      )
      .then(() =>
        this.props.dispatch(fetchCollectionsAndDonations())
      );
    e.preventDefault();
  };

  removeCollection = idx => () => {
    this.props
      .dispatch(
        removeCollection({
          id: idx
        }),
      )
      .then(() =>
        this.props.dispatch(fetchCollectionsAndDonations())
      );

  };

  render() {
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">박스 수량 정하기</li>
        </ol>
        <h1 className="page-title">박스 수량 정하기</h1>
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
        <CardColumns style={{marginBottom: '10px'}}>
            {
              this.state.collections.map((collection, index) =>
                  <Card key={collection.id}>
                    <CardHeader tag="h5">{collection.name}
                    <button type="button" className="close" aria-label="Close" onClick={this.removeCollection(collection.id)}>
                      <span aria-hidden="true">×</span>
                    </button>
                    </CardHeader>
                        <CardBody>
                          <h6> 구성 상품</h6>
                          <hr/>
                        {
                          collection.donations.map((donation, index) =>
                            <div key={donation.donation_id}>{donation.name} <span style={{float: "right"}}>{donation.quantity}</span></div>
                          )
                        }
                        <hr/>
                        만들 수량
                        <Input
                        value = {collection.collection_quantity}
                        onChange = {this.handleQuantity(index)}
                        required
                        type="number"
                        min = "0"
                        style={{ display:"flex"}}
                        />
                        </CardBody>
                    <CardFooter>
                      (유통기한: {(JSON.parse(collection.expiration_date).length>0) ? new Date(Math.min.apply(null, JSON.parse(collection.expiration_date).map(date => new Date(date)))).toISOString().substring(0, 10) : "없음"})
                    </CardFooter>
                  </Card>
              )
            }
         </CardColumns>
        <div style={{float: 'left'}}>* 정합성 체크를 해야 생성버튼이 활성화 됩니다</div>
         <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
           <ButtonGroup>
             <Button color="warning" onClick={this.checkFeasibility}>
                {'정합성 체크'}
              </Button>
              <Button color="success" type="submit" onClick= {this.doSetQuantity} disabled={!this.state.feasibility}>
                {this.props.isFetching ? '저장...' : '수량 정하기'}
              </Button>
           </ButtonGroup>
         </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.posts.message,
    errorMessage: state.posts.errorMessage,
    donations: state.posts.donations,
    collectionsForMaking: state.posts.collectionsForMaking,
    switches: state.posts.switches
  };
}

export default connect(mapStateToProps)((withMeta(Making)));
