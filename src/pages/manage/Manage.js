import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import {connect} from 'react-redux';
import RegisterUser from './registerUser/RegisterUser';
import manageRecipientCategory from './manageRecipientCategory/ManageRecipientCategory'
import viewMemberList from './userListMember/UserListMember'
import viewVolunteerList from './userListVolunteer/UserListVolunteer'
import manageSeason from './manageSeason/ManageSeason'

class Manage extends React.Component {
  render() {
    {
      if (this.props.orgType !== 'admin') {
        return <Redirect to="/app"/>;
      }
    }
    return (
      <Switch>
        <Route path="/app/manage/member/registerUser" exact component={RegisterUser}/>
        <Route path="/app/manage/member/memberList" exact component={viewMemberList}/>
        <Route path="/app/manage/member/volunteerList" exact component={viewVolunteerList}/>
        <Route path="/app/manage/configuration/manageRecipientCategory" exact component={manageRecipientCategory}/>
        <Route path="/app/manage/configuration/manageSeason" exact component={manageSeason}/>
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
