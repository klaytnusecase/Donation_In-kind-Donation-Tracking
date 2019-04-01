import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import {connect} from 'react-redux';
import RegisterUser from './registerUser/RegisterUser';
import manageRecipientCategory from './manageRecipientCategory/ManageRecipientCategory'

class Manage extends React.Component {
  render() {
    {
      if (this.props.orgType !== 'admin') {
        return <Redirect to="/app"/>;
      }
    }
    return (
      <Switch>
        <Route path="/app/manage/registerUser" exact component={RegisterUser}/>
        <Route path="/app/manage/manageRecipientCategory" exact component={manageRecipientCategory}/>
      </Switch>
    );
  }
}
function mapStateToProps(state) {
  return {
    orgType: state.auth.org_type,
  };
}
export default withRouter(connect(mapStateToProps)(Manage));
