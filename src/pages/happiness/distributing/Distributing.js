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
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchCollectionsDistribution, updateCollectionDistribution} from '../../../actions/happiness';
import { fetchSwitch, changeSwitchStatus} from '../../../actions/configuration';



class Distributing extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    message: PropTypes.string,
    switches: PropTypes.object,
    isFetching: PropTypes.bool,
    quantities: PropTypes.array,
    collections: PropTypes.array,
    volunteers: PropTypes.array,
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    switches: {},
    quantities: [],
    collections: [],
    volunteers: []
  };
  static meta = {
    title: 'Distribute new happiness box',
    description: 'About description',
  };
  componentWillMount() {
    this.props.dispatch(fetchCollectionsDistribution()).then(() => {
      this.setState({
        collections: this.props.collections,
        volunteers: this.props.volunteers,
        quantities: this.props.quantities
      }, () => {
        const SummationArray = Array(this.state.collections.length).fill(0)
        for (let i = 0; i < this.state.volunteers.length; i++) {
          for (let j = 0; j < this.state.collections.length; j++) {
            SummationArray[j] += this.state.quantities[i][j]
          }
        }
        const limitArray = Array(this.state.collections.length).fill(0)
        for (let i = 0; i < this.state.collections.length; i++)
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
          volunteer_affiliations: volunteers_affiliation_list,
        })
      })
    })
    this.props.dispatch(fetchSwitch()).then(()=> {
      if (this.props.switches.switch_3 === true) {
        window.alert('이미 최종배분이 완료 되었습니다');
        window.location.replace('/app');
      }
      if (this.props.switches.switch_1 === false) {
        window.alert('정보가 바뀌었습니다. 다시 수량을 정하고 오세요.');
        window.location.replace('/app');
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      volunteers: [],
      quantities: [],
      feasibility: false,
      total: [],
      limit: [],
      collection_ids: [],
      volunteer_names: [],
      volunteer_affiliations: []
    }
  }

  handleQuantity= (index_i, index_j) => evt => {

    let value = parseInt(evt.target.value);
    if (value === 'Nan') value = 0;
    const newQuantities = this.state.quantities;
    newQuantities[index_i][index_j] = value;
    let total = 0;
    for (let i=0; i < this.state.volunteers.length; i++)
      total += newQuantities[i][index_j]
    const newTotal = this.state.total;
    newTotal[index_j] = total
    this.setState({ quantities: newQuantities, total: newTotal, feasibility: false});
  };

  checkFeasibility= (e) => {
    let check = true;
    const limit = this.state.limit;
    const total = this.state.total;
    for (const i in limit){
      if (limit[i] < total[i]) check = false
      if (isNaN(total[i])) check = false
    }
    if (check) window.confirm('정합성 체크가 완료 되었습니다. 제출할 준비가 되었습니다.')
    else  window.confirm('값을 다시 확인해주세요.')
    this.setState({feasibility: check});
  };

  doDistributeBoxes = (e) => {
    this.props
      .dispatch(
        updateCollectionDistribution({
          collection_ids: this.state.collection_ids,
          volunteer_names: this.state.volunteer_names,
          quantities: this.state.quantities,
        }),
      ).then(
        this.props.dispatch(fetchCollectionsDistribution())
    );
    e.preventDefault();
    this.props.dispatch(changeSwitchStatus({
      'type': 'switch_2',
      'status': true
    }))
  };


  render(){
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">박스 분배 수량 정하기</li>
        </ol>

        <h1 className="page-title">박스 분배 수량 정하기</h1>
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
                              onChange={this.handleQuantity(index_i, index_j)}
                              required
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
               <Button color="warning" onClick={this.checkFeasibility}>
                {'정합성 체크'}
              </Button>
              <Button color="success" onClick={this.doDistributeBoxes} disabled={!this.state.feasibility}>
                {this.props.isFetching ? '처리 중...' : '임시저장'}
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
    quantities: state.posts.quantities,
    collections: state.posts.collections,
    volunteers: state.posts.volunteers,
    switches: state.posts.switches
  };
}


export default connect(mapStateToProps)((withMeta(Distributing)));
