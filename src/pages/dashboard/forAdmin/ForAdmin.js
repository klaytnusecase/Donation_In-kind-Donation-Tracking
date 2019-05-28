import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Circle from 'react-circle';

import {
  Row,
  Col,
  Alert,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  Progress,
  Badge,
  ListGroup,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Table,
  Carddeck,
  Card
} from 'reactstrap';

import dbSchema from '../../../images/prisming_db_schema.png';
import Widget from '../../../components/Widget';
import s from './ForAdmin.scss';
import {fetchBoxStatus} from '../../../actions/posts'
import {fetchSwitch, changeSwitchStatus} from '../../../actions/configuration';

class ForAdmin extends Component {
  /* eslint-disable */
  static propTypes = {
    isFetching: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    status: PropTypes.array,
  };
  /* eslint-enable */

  static defaultProps = {
    isFetching: false,
    posts: [],
    status: [],
  };

  state = {
    isDropdownOpened: false,
  };

  componentWillMount() {
    this.props.dispatch(fetchBoxStatus());
  }


  constructor(props) {
    super(props);
  }

  initialize = () => {
    this.props.dispatch(changeSwitchStatus({
      'type': 'switch_3',
      'status': false,
    }));
  }

  render() {
    console.log(this.props);
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>Dashboard</BreadcrumbItem>
        </Breadcrumb>

        <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
          <ButtonGroup>
          <Button color="danger" onClick={this.initialize}>
            {'테스트용 초기화'}
          </Button>
          </ButtonGroup>
        </div>

        <h1 className="mb-lg">Current Status of Boxes {this.props.isFetching ? "(불러오는 중입니다)" : ""}</h1>
        {!this.props.isFetching &&
        <Row>
          <Col sm={4}>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">Before Receipt</h3>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">{this.props.status.filter((x) => x=="0").length} 개</h3>
            </div>
            <div className="d-flex justify-content-center">
            <Circle
              size={200}
              progress={(this.props.status.length!==1) ? (this.props.status.filter((x) => x=="0").length/(this.props.status.length - 1)* 100).toFixed(1) : 0}
              progressColor="Maroon"
              bgColor="Moccasin"
              textStyle={{
                 font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
              }}
              percentSpacing={10}
              roundedStroke
              showPercentage // Boolean: Show/hide percentage.
              showPercentageSymbol
            />
            </div>
          </Col>
          <Col sm={4}>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">Receipt Complete</h3>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">{this.props.status.filter((x) => x=="1").length} 개</h3>
            </div>
            <div className="d-flex justify-content-center">
            <Circle
              size={200}
              progress={(this.props.status.length!==1) ? (this.props.status.filter((x) => x=="1").length/(this.props.status.length - 1) * 100).toFixed(1) : 0}
              progressColor="Maroon"
              bgColor="Moccasin"
              textStyle={{
                 font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
              }}
              percentSpacing={10}
              roundedStroke
              showPercentage // Boolean: Show/hide percentage.
              showPercentageSymbol
            />
            </div>
          </Col>
          <Col sm={4}>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">Deliver Complete</h3>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">{this.props.status.filter((x) => x=="2").length} 개</h3>
            </div>
            <div className="d-flex justify-content-center">
            <Circle
              size={200}
              progress={(this.props.status.length!==1) ? (this.props.status.filter((x) => x=="2").length/(this.props.status.length - 1) * 100).toFixed(1) : 0}
              progressColor="Maroon"
              bgColor="Moccasin"
              textStyle={{
                 font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
              }}
              percentSpacing={10}
              roundedStroke
              showPercentage // Boolean: Show/hide percentage.
              showPercentageSymbol
            />
            </div>
          </Col>
          <hr/>
        </Row>
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    status: state.posts.status,
    klaytnAddress: state.auth.klaytnAddress,
  };
}

export default connect(mapStateToProps)(withStyles(s)(ForAdmin));
