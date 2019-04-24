import React from 'react';
import PropTypes from 'prop-types';
import axios, { post } from 'axios';
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
  Alert,
  FormGroup,
  Table,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';

class UploadReceipt extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    message: PropTypes.string,
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool,
  };
  static defaultProps = {
    isFetching: false,
    message: null,
    errorMessage: null,
  };
  static meta = {
    title: 'Upload receipts',
    description: 'About description',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: ''
    };
  }
  handleFiles = () => {
    this.setState({
      selectedFile: event.target.files[0],
    })
  }
  onClickHandler = (e) => {
    e.preventDefault() // Stop form submit
    this.fileUpload().then((response)=>{
      console.log(response.data);
    })
  }
  fileUpload = () =>{
    const url = '/upload'
    const data = new FormData()
    data.append('file', this.state.selectedFile)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  post(url, data,config)

  }


   fileUpload(file){
    const url = 'http://example.com/file-upload';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  post(url, formData,config)
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">수령증 업로드하기</li>
        </ol>

        <h1 className="page-title">수령증 업로드하기</h1>
        <Widget>
          <FormGroup>
            <Input
              onChange= {this.handleFiles}
              type="file"
            />
          </FormGroup>
          <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
        </Widget>
      </div>


    );
  }
}

//{this.state.selectedData &&
//  <CSVLink data={this.state.selectedData} headers={headers}>선택 데이터 다운로드</CSVLink>}


function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    message: state.posts.message,
    errorMessage: state.posts.errorMessage,
    klaytnAddress: state.auth.klaytnAddress,
  };
}

export default connect(mapStateToProps)((withMeta(UploadReceipt)));
