import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import {connect} from 'react-redux';

import AdminDashboard from './forAdmin/ForAdmin';
import MemberDashboard from './forMember/ForMember';
import VolunteerDashboard from './forVolunteer/ForVolunteer';


class Dashboard extends React.Component {

  render() {
    switch(this.props.orgType){
      case 'member':
        return (
          <Switch>
            <Route path="/app" exact component={MemberDashboard} />
          </Switch>
        );

      case 'volunteer':
        return (
          <Switch>
            <Route path="/app" exact component={VolunteerDashboard} />
          </Switch>
        );

      case 'admin':
        return (
        <Switch>
            <Route path="/app" exact component={AdminDashboard} />
        </Switch>
        );
    }

  }
}

function mapStateToProps(state) {
  return {
    orgType: state.auth.org_type,
    klaytnAddress: state.auth.klaytnAddress,
  };
}


export default withRouter(connect(mapStateToProps)(Dashboard));
