import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import {connect} from 'react-redux';

import AdminChecking from './forAdmin/AdminChecking';
import VolunteerChecking from './forVolunteer/VolunteerChecking';
// import VolunteerDashboard from './forVolunteer/ForVolunteer';


class Checking extends React.Component {
  render() {

    switch(this.props.orgType){
      case 'volunteer':
        return (
          <Switch>
            <Route path="/app/happiness/checking" exact component={VolunteerChecking} />
          </Switch>
        );

      case 'admin':
        return (
        <Switch>
            <Route path="/app/happiness/checking" exact component={AdminChecking} />
        </Switch>
        );
    }
  }
}

function mapStateToProps(state) {
  return {
    orgType: state.auth.org_type,
  };
}


export default withRouter(connect(mapStateToProps)(Checking));
