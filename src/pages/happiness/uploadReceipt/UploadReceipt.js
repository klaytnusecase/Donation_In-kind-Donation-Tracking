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
    isFetching: PropTypes.bool,
  };
  static defaultProps = {
    isFetching: false,
  };
  static meta = {
    title: 'Upload receipts',
    description: 'About description',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: '',
      message: null,
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
      this.setState({
      message: 'Upload complete',
    })
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


  render() {
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">YOU ARE HERE</li>
          <li className="breadcrumb-item">Happiness Box</li>
          <li className="active breadcrumb-item">Upload Signed Receipt</li>
        </ol>

        <h1 className="page-title">Upload Signed Receipt</h1>
         {this.state.message && (
                    <Alert size="sm" color="info">
                      {this.state.message}
                    </Alert>
                  )}
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


function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
  };
}

export default connect(mapStateToProps)((withMeta(UploadReceipt)));
